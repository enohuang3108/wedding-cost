import { renderers, type RenderableTreeNodes } from "@markdoc/markdoc";
import * as React from "react";

export function Markdown({ content }: { content: RenderableTreeNodes }) {
    return (
        <div className="prose prose-zinc mx-auto max-w-screen-sm">
            {renderers.react(content, React)}
        </div>
    );
}
