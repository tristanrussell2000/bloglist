import { useState, forwardRef, useImperativeHandle } from "react"

const Togglable = forwardRef(function Togglable({buttonLabel, children}, refs) {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = {display: visible ? "none" : ""}
    const showWhenVisible = {display: visible ? "" : "none"}

    useImperativeHandle(refs, () => {
        return {
            toggleVisible: () => setVisible(!visible)
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible} className="togglableContent">
                {children}
                <button onClick={() => setVisible(!visible)}>Cancel</button>
            </div>
        </div>
    )
})

export default Togglable