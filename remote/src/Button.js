import React from "react";


const Button = () => {
React.useEffect(() => {
  console.log('remote effect');
}, [])
return <button>Hello from remote</button>};
export default Button;
