/**
 * Нури борике, ки оҳиста дар канори корт давр мезанад.
 * CSS дар globals.css (.border-beam); бо prefers-reduced-motion қатъ мешавад.
 */
export function BorderBeam({ duration = 8 }: { duration?: number }) {
  return <span aria-hidden className="border-beam" style={{ animationDuration: `${duration}s` }} />;
}
