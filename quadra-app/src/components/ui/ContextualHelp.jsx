import { useState } from 'react'
import { IconInfo, IconChevronDown } from './Icons'

export default function ContextualHelp({ term, explanation }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="ctx-help">
      <button
        type="button"
        className="ctx-help-trigger"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <IconInfo />
        <span>{term}</span>
        <span className="ctx-help-chevron" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>
          <IconChevronDown />
        </span>
      </button>
      {open && (
        <div className="ctx-help-body">
          {explanation}
        </div>
      )}
    </div>
  )
}
