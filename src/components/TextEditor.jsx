import { useState } from 'react'
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Trash2,
  Save,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Sarabun',
  'Noto Sans Thai',
]

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64]

const COLORS = [
  '#ffffff',
  '#000000',
  '#00d4aa',
  '#3b82f6',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#6b7280',
]

export default function TextEditor({ isVisible, onClose }) {
  const [textLayers, setTextLayers] = useState([])
  const [activeLayerIdx, setActiveLayerIdx] = useState(null)
  const [fontFamily, setFontFamily] = useState('Inter')
  const [fontSize, setFontSize] = useState(24)
  const [fontColor, setFontColor] = useState('#ffffff')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState('center')
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [lineHeight, setLineHeight] = useState(1.4)

  if (!isVisible) return null

  const addTextLayer = () => {
    const newLayer = {
      id: Date.now(),
      text: 'New Text',
      fontFamily: 'Inter',
      fontSize: 24,
      fontColor: '#ffffff',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1.4,
    }
    setTextLayers([...textLayers, newLayer])
    setActiveLayerIdx(textLayers.length)
    // Sync controls
    setFontFamily(newLayer.fontFamily)
    setFontSize(newLayer.fontSize)
    setFontColor(newLayer.fontColor)
    setIsBold(newLayer.isBold)
    setIsItalic(newLayer.isItalic)
    setIsUnderline(newLayer.isUnderline)
    setTextAlign(newLayer.textAlign)
    setLetterSpacing(newLayer.letterSpacing)
    setLineHeight(newLayer.lineHeight)
  }

  const updateActiveLayer = (updates) => {
    if (activeLayerIdx === null) return
    setTextLayers((layers) =>
      layers.map((layer, idx) =>
        idx === activeLayerIdx ? { ...layer, ...updates } : layer
      )
    )
  }

  const deleteActiveLayer = () => {
    if (activeLayerIdx === null) return
    setTextLayers((layers) => layers.filter((_, idx) => idx !== activeLayerIdx))
    setActiveLayerIdx(null)
  }

  const selectLayer = (idx) => {
    setActiveLayerIdx(idx)
    const layer = textLayers[idx]
    if (layer) {
      setFontFamily(layer.fontFamily)
      setFontSize(layer.fontSize)
      setFontColor(layer.fontColor)
      setIsBold(layer.isBold)
      setIsItalic(layer.isItalic)
      setIsUnderline(layer.isUnderline)
      setTextAlign(layer.textAlign)
      setLetterSpacing(layer.letterSpacing)
      setLineHeight(layer.lineHeight)
    }
  }

  return (
    <div className="border-t border-brand-border bg-brand-sidebar">
      {/* Toolbar Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-brand-accent" />
          <span className="text-sm font-semibold text-brand-text">Text Editor</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={addTextLayer}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-brand-accent bg-brand-accent/10 rounded hover:bg-brand-accent/20 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Text
          </button>
          {activeLayerIdx !== null && (
            <button
              onClick={deleteActiveLayer}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-brand-danger bg-brand-danger/10 rounded hover:bg-brand-danger/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-brand-text-muted hover:text-brand-text rounded transition-colors cursor-pointer ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex items-center gap-3 px-4 py-2 flex-wrap">
        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => {
            setFontFamily(e.target.value)
            updateActiveLayer({ fontFamily: e.target.value })
          }}
          className="bg-brand-card text-brand-text text-xs border border-brand-border rounded px-2 py-1.5 outline-none focus:border-brand-accent min-w-[120px]"
          aria-label="Font family"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Font Size */}
        <select
          value={fontSize}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            setFontSize(val)
            updateActiveLayer({ fontSize: val })
          }}
          className="bg-brand-card text-brand-text text-xs border border-brand-border rounded px-2 py-1.5 outline-none focus:border-brand-accent w-16"
          aria-label="Font size"
        >
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}px</option>
          ))}
        </select>

        {/* Separator */}
        <div className="w-px h-6 bg-brand-border" />

        {/* Bold / Italic / Underline */}
        <button
          onClick={() => {
            setIsBold(!isBold)
            updateActiveLayer({ isBold: !isBold })
          }}
          className={cn(
            'p-1.5 rounded transition-colors cursor-pointer',
            isBold ? 'bg-brand-accent/20 text-brand-accent' : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-card'
          )}
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setIsItalic(!isItalic)
            updateActiveLayer({ isItalic: !isItalic })
          }}
          className={cn(
            'p-1.5 rounded transition-colors cursor-pointer',
            isItalic ? 'bg-brand-accent/20 text-brand-accent' : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-card'
          )}
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setIsUnderline(!isUnderline)
            updateActiveLayer({ isUnderline: !isUnderline })
          }}
          className={cn(
            'p-1.5 rounded transition-colors cursor-pointer',
            isUnderline ? 'bg-brand-accent/20 text-brand-accent' : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-card'
          )}
          aria-label="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-brand-border" />

        {/* Text Alignment */}
        {['left', 'center', 'right'].map((align) => {
          const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
          return (
            <button
              key={align}
              onClick={() => {
                setTextAlign(align)
                updateActiveLayer({ textAlign: align })
              }}
              className={cn(
                'p-1.5 rounded transition-colors cursor-pointer',
                textAlign === align ? 'bg-brand-accent/20 text-brand-accent' : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-card'
              )}
              aria-label={`Align ${align}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}

        {/* Separator */}
        <div className="w-px h-6 bg-brand-border" />

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                setFontColor(color)
                updateActiveLayer({ fontColor: color })
              }}
              className={cn(
                'w-5 h-5 rounded-full border-2 transition-transform cursor-pointer',
                fontColor === color ? 'border-brand-accent scale-110' : 'border-brand-border hover:scale-110'
              )}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-brand-border" />

        {/* Letter Spacing */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-brand-text-muted">Spacing</span>
          <input
            type="range"
            min={-2}
            max={10}
            step={0.5}
            value={letterSpacing}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              setLetterSpacing(val)
              updateActiveLayer({ letterSpacing: val })
            }}
            className="w-16 accent-[#00d4aa]"
            aria-label="Letter spacing"
          />
          <span className="text-[10px] text-brand-text-muted w-6">{letterSpacing}</span>
        </div>

        {/* Line Height */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-brand-text-muted">Line</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={lineHeight}
            onChange={(e) => {
              const val = parseFloat(e.target.value)
              setLineHeight(val)
              updateActiveLayer({ lineHeight: val })
            }}
            className="w-16 accent-[#00d4aa]"
            aria-label="Line height"
          />
          <span className="text-[10px] text-brand-text-muted w-6">{lineHeight.toFixed(1)}</span>
        </div>
      </div>

      {/* Text Layers List */}
      {textLayers.length > 0 && (
        <div className="px-4 py-2 border-t border-brand-border">
          <div className="flex gap-2 flex-wrap">
            {textLayers.map((layer, idx) => (
              <div
                key={layer.id}
                className="flex-1 min-w-[200px]"
              >
                <button
                  onClick={() => selectLayer(idx)}
                  className={cn(
                    'w-full text-left p-2 rounded border text-xs cursor-pointer transition-colors',
                    activeLayerIdx === idx
                      ? 'border-brand-accent bg-brand-accent/10'
                      : 'border-brand-border bg-brand-card hover:bg-brand-card-hover'
                  )}
                >
                  <input
                    type="text"
                    value={layer.text}
                    onChange={(e) => {
                      setTextLayers((layers) =>
                        layers.map((l, i) =>
                          i === idx ? { ...l, text: e.target.value } : l
                        )
                      )
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectLayer(idx)
                    }}
                    className="w-full bg-transparent outline-none text-brand-text"
                    style={{
                      fontFamily: layer.fontFamily,
                      fontSize: `${Math.min(layer.fontSize, 18)}px`,
                      fontWeight: layer.isBold ? 'bold' : 'normal',
                      fontStyle: layer.isItalic ? 'italic' : 'normal',
                      textDecoration: layer.isUnderline ? 'underline' : 'none',
                      color: layer.fontColor,
                      textAlign: layer.textAlign,
                      letterSpacing: `${layer.letterSpacing}px`,
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {textLayers.length === 0 && (
        <div className="px-4 py-3 text-xs text-brand-text-muted text-center">
          Click "Add Text" to create text overlays on your creatives
        </div>
      )}
    </div>
  )
}
