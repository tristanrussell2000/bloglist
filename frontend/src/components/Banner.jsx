import { Callout } from "@blueprintjs/core"

function Banner({message, color}) {
    const intent = color === "green"
    ? "success"
    : color === "red"
    ? "danger"
    : "primary"
    return (
        <Callout intent={intent}>
            {message}
        </Callout>
    )
}

export default Banner