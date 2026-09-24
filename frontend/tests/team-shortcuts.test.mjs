import { describe, it } from "node:test"
import assert from "node:assert/strict"
import * as navigation from "../src/lib/team-navigation.js"

const expectedUrls = [
  "https://dev.lumosgraphy.com/",
  "https://lab.dev.lumosgraphy.com/",
  "https://admin.dev.lumosgraphy.com/",
]

describe("team navigation", () => {
  it("hides Admin and blocks Alt+3 unless administrator status is confirmed", () => {
    assert.equal(typeof navigation.getVisibleTeams, "function")
    for (const isAdmin of [undefined, false, null, "true"]) {
      const teams = navigation.getVisibleTeams(Object.values(navigation.TEAM_LINKS), isAdmin)
      assert.deepEqual(teams.map(team => team.name), ["Lumos Photo", "Lumos Lab"])
      const calls = []
      navigation.handleTeamShortcut({
        altKey: true, key: "3", code: "Digit3",
        preventDefault() { throw new Error("Hidden shortcut must not be consumed") },
      }, teams, team => calls.push(team))
      assert.deepEqual(calls, [])
    }
    const teams = navigation.getVisibleTeams(Object.values(navigation.TEAM_LINKS), true)
    const calls = []
    navigation.handleTeamShortcut({
      altKey: true, key: "3", code: "Digit3", preventDefault() {},
    }, teams, team => calls.push(team.url))
    assert.deepEqual(calls, ["https://admin.dev.lumosgraphy.com/"])
  })
  it("opens all three named teams in new tabs in the shared order", () => {
    const teams = Object.values(navigation.TEAM_LINKS ?? {})
    assert.deepEqual(teams.map(team => team.name), ["Lumos Photo", "Lumos Lab", "Lumos Admin"])
    const calls = []
    teams.forEach(team => navigation.openTeamLink(team, (...args) => calls.push(args)))
    assert.deepEqual(calls, expectedUrls.map(url => [url, "_blank", "noopener,noreferrer"]))
  })

  it("maps Alt+1/2/3 to the same destinations, including Option-key symbols", () => {
    assert.equal(typeof navigation.handleTeamShortcut, "function")
    const teams = Object.values(navigation.TEAM_LINKS)
    const calls = []
    let prevented = 0
    for (const [index, key] of ["1", "2", "£"].entries()) {
      navigation.handleTeamShortcut({
        altKey: true, key, code: "Digit" + (index + 1),
        preventDefault() { prevented++ },
      }, teams, team => calls.push(team.url))
    }
    assert.deepEqual(calls, expectedUrls)
    assert.equal(prevented, 3)
  })

  it("does not navigate while typing, repeating, composing, or using other modifiers", () => {
    assert.equal(typeof navigation.handleTeamShortcut, "function")
    const teams = Object.values(navigation.TEAM_LINKS)
    const calls = []
    let prevented = 0
    for (const override of [
      { altKey: false }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true },
      { repeat: true }, { isComposing: true }, { defaultPrevented: true },
      { key: "4", code: "Digit4" }, { key: "0", code: "Digit0" },
      { target: { tagName: "INPUT" } }, { target: { tagName: "TEXTAREA" } },
      { target: { tagName: "SELECT" } }, { target: { isContentEditable: true } },
    ]) {
      navigation.handleTeamShortcut({
        altKey: true, key: "1", code: "Digit1",
        preventDefault() { prevented++ }, ...override,
      }, teams, team => calls.push(team))
    }
    assert.deepEqual(calls, [])
    assert.equal(prevented, 0)
  })
})
