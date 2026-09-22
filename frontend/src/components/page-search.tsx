"use client"

import { Dialog } from "@base-ui/react/dialog"
import { SearchIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useId, useRef, useState, type RefObject } from "react"
import { studyPages } from "@/lib/study-pages"
import { searchStudyPages } from "@/lib/study-search"

function SearchResults({ onSelect }: { onSelect: (href: string) => void }) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const results = searchStudyPages(query, studyPages)
  const listId = useId()
  const activeOption = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeOption.current?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, query])

  return (
    <>
      <div className="flex items-center gap-3 border-b px-4 pb-4">
        <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
        <input
          autoFocus
          role="combobox"
          aria-label="페이지 검색어"
          aria-autocomplete="list"
          aria-expanded={true}
          aria-controls={listId}
          aria-activedescendant={results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
          className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          placeholder="제목이나 키워드를 입력하세요"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing || event.keyCode === 229) return
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              if (results.length) setActiveIndex((index) =>
                (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length)
            }
            if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault()
              onSelect(results[activeIndex].href)
            }
          }}
        />
      </div>
      <p role="status" className="px-4 pt-3 text-xs text-muted-foreground">
        {query.trim() ? `${results.length}개 페이지` : "예: 의존성 주입, 분산 락, Scanner"}
      </p>
      <div id={listId} role="listbox" aria-label="학습 페이지 검색 결과" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
        {results.map((page, index) => (
          <button
            key={page.href}
            id={`${listId}-${index}`}
            ref={index === activeIndex ? activeOption : undefined}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            tabIndex={-1}
            className="flex w-full cursor-pointer flex-col gap-1 rounded-lg px-3 py-3 text-left hover:bg-accent aria-selected:bg-accent"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSelect(page.href)}
          >
            <span className="text-xs text-muted-foreground">{page.category}</span>
            <span className="break-words text-sm font-semibold">{page.title}</span>
            {page.simulated && <span className="w-fit rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-950 dark:bg-amber-950 dark:text-amber-200">모의 실습</span>}
            <span className="break-words text-xs leading-5 text-muted-foreground">{page.description}</span>
          </button>
        ))}
      </div>
      {!results.length && <p className="break-words px-5 py-8 text-center text-sm text-muted-foreground">
        {query.trim() ? `“${query}”에 맞는 페이지가 없습니다. 다른 제목이나 키워드로 찾아보세요.` : "페이지 제목을 몰라도 관련 용어로 찾을 수 있습니다."}
      </p>}
      <div className="border-t px-4 py-3 text-xs text-muted-foreground">↑↓ 선택 · Enter 이동 · Esc 닫기</div>
    </>
  )
}

export function PageSearch({ open, onOpenChange, triggerRef }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}) {
  const router = useRouter()
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!event.isComposing && event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onOpenChange])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" />
        <Dialog.Popup
          className="fixed top-[8dvh] left-1/2 z-[60] flex max-h-[84dvh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl"
          initialFocus={(type) => type === "touch" ? true : document.querySelector<HTMLInputElement>('[aria-label="페이지 검색어"]')}
          finalFocus={() => triggerRef.current?.isConnected && triggerRef.current.getClientRects().length
            ? triggerRef.current : document.querySelector<HTMLButtonElement>('[data-sidebar="trigger"]')}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Dialog.Title className="text-sm font-semibold">페이지 검색</Dialog.Title>
            <Dialog.Close aria-label="검색 닫기" className="flex size-9 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"><XIcon className="size-4" /></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">제목, 이전 제목과 관련 키워드로 학습 페이지를 검색합니다.</Dialog.Description>
          {open && <SearchResults onSelect={(href) => { onOpenChange(false); router.push(href) }} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
