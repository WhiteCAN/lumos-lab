const TEAM_LINKS = {
  lumosGraphy: {
    name: "Lumos Photo",
    plan: "사진 커뮤니티",
    url: "https://dev.lumosgraphy.com/",
    target: "_blank",
  },
  lumosLab: {
    name: "Lumos Lab",
    plan: "학습 실험실",
    url: "https://lab.dev.lumosgraphy.com/",
    target: "_blank",
  },
  lumosAdmin: {
    name: "Lumos Admin",
    plan: "관리자",
    url: "https://admin.dev.lumosgraphy.com/",
    target: "_blank",
    adminOnly: true,
  },
}

function getVisibleTeams(teams, isAdmin = false) {
  return teams.filter(team => !team.adminOnly || isAdmin === true)
}

function openTeamLink(team, openWindow = window.open.bind(window)) {
  if (!team?.url) return false
  openWindow(team.url, "_blank", "noopener,noreferrer")
  return true
}

function handleTeamShortcut(event, teams, navigate = openTeamLink) {
  if (event.defaultPrevented || event.repeat || event.isComposing) return
  if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  const target = event.target
  if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return
  const key = /^Digit[1-9]$/.test(event.code) ? event.code.slice(-1) : event.key
  if (!/^[1-9]$/.test(key)) return
  const team = teams[Number(key) - 1]
  if (!team) return
  event.preventDefault()
  navigate(team)
}

module.exports = { TEAM_LINKS, openTeamLink, handleTeamShortcut, getVisibleTeams }
