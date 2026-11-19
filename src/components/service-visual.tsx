type VisualKind = "code" | "film" | "image" | "layers" | "camera";

function VisualDetails({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "code":
      return <div className="visual-browser"><div className="visual-browser-bar"><i /><i /><i /></div><div className="visual-browser-body"><i /><div><i /><i /><i /><i /></div><span /></div></div>;
    case "film":
      return <div className="visual-timeline"><div className="visual-film-strip"><i /><i /><i /></div><div className="visual-film-tracks"><i /><i /><i /><i /><i /></div><span /></div>;
    case "image":
      return <div className="visual-grade"><div className="visual-grade-image"><i /></div><div className="visual-grade-controls"><i /><i /><i /></div></div>;
    case "layers":
      return <div className="visual-tiles"><i /><i /><i /></div>;
    case "camera":
      return <div className="visual-lens"><i /><i /><i /><span /></div>;
  }
}

export function ServiceVisual({ kind }: { kind: VisualKind }) {
  return <div className={"service-visual visual-" + kind} aria-hidden="true"><VisualDetails kind={kind} /></div>;
}