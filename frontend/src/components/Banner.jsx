function Banner({message, color}) {
    return (
        <div style={{"border": `2px solid ${color}`}}>
            {message}
        </div>
    )
}

export default Banner