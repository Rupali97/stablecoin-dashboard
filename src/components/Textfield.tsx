

function Textfield(props: any) {
  const {text, color, fontSize, fontWeight,className} = props
  return (
    <div 
      className={className}
      style={{
            color, fontSize, fontWeight
      }}>
      {text}
    </div>
  )
}

export default Textfield