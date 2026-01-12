export default function RenderBlocks({ content }) {
    const data = content?.blocks ? content : { blocks: [] };

    return (
        <div>
            {data.blocks.map((b, i) => {
                if (b.type === "header") {
                    const Tag = `h${b.data.level || 2}`;
                    return <Tag key={i}>{b.data.text}</Tag>;
                }
                if (b.type === "paragraph") return <p key={i}>{b.data.text}</p>;
                if (b.type === "list") {
                    const ListTag = b.data.style === "ordered" ? "ol" : "ul";
                    return (
                        <ListTag key={i}>
                            {b.data.items.map((it, idx) => (
                                <li key={idx}>{it}</li>
                            ))}
                        </ListTag>
                    );
                }
                if (b.type === "quote") return <blockquote key={i}>{b.data.text}</blockquote>;
                return null;
            })}
        </div>
    );
}
