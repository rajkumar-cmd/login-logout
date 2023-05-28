import React from 'react'
import Style from "./App.module.css"
import { Input, Tabs, TabList, TabPanels, Tab, TabPanel, Select, Button } from '@chakra-ui/react'
import Security from './Security'

const App = () => {
  const [loggedin, setLoggedin]=React.useState(false)
  const [valueSignup, setValueSignup] = React.useState({
    name: "",
    email: "",
    password: "",
    securityQuestion: "",
    securityAnswer: ""
  })
  const [valueLogin, setValueLogin] = React.useState({
    email: "",
    password: ""
  })
  const handleChangeSignup = (e) => {
    let name = e.target.name;
    let values = e.target.value;
    setValueSignup({
      ...valueSignup,
      [name]: values
    });
  }
  const handleChangeLogin = (e) => {
    let name = e.target.name;
    let values = e.target.value;
    setValueLogin({
      ...valueLogin,
      [name]: values
    });
  }
  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    console.log(valueLogin)
    let res = await fetch("https://forgetpassword-backend.onrender.com/user/login", {
      method: "POST",
      body: JSON.stringify(valueLogin),
      headers: {
        "Content-type": "application/json"
      }
    })
    let data = await res.json();
    if (data.msg === "Wrong Credientials") {
      alert("Invalid Credentials");
      return;
    }
    localStorage.setItem("email", data.email)
    localStorage.setItem("SQ", data.SQ)
    alert("You are now logged in");
    setLoggedin(true);
    setValueLogin({
      email: "",
      password: ""
    })
  }
  const handleSubmitSignup = async (event) => {
    event.preventDefault();
    console.log(valueSignup)
    await fetch("https://forgetpassword-backend.onrender.com/user/register", {
      method: "POST",
      body: JSON.stringify(valueSignup),
      headers: {
        "Content-type": "application/json"
      }
    })
    setValueSignup({
      name: "",
      email: "",
      password: "",
      securityQuestion: "",
      securityAnswer: ""
    })
    alert("You are now signed up")
  }
  const handleLogout=()=>{
    setLoggedin(false);
  }
  return loggedin?(<div className={Style.logoutmain}>
    <Button className={Style.logout} onClick={handleLogout}>Log Out</Button>
  </div>):(
    <div className={Style.main}>
      <Tabs isFitted variant='enclosed'>
        <TabList>
          <Tab _selected={{ color: 'rgba(0, 0, 0, 0.721)', bg: 'rgba(0, 123, 255, 0.476)', fontSize: "1.3rem" }}>Login</Tab>
          <Tab _selected={{ color: 'rgba(0, 0, 0, 0.721)', bg: 'rgba(0, 255, 68, 0.476)', fontSize: "1.3rem" }}>Signup</Tab>
        </TabList>

        <TabPanels>
          <TabPanel className={Style.form}>
            <form onSubmit={handleSubmitLogin}>
              <p style={{ fontSize: "1.3rem" }}>Email</p>
              <Input style={{ fontSize: "1.3rem" }} onChange={handleChangeLogin} type="email" name='email' value={valueLogin.email} placeholder="Enter Email" />
              <p style={{ fontSize: "1.3rem" }}>Password</p>
              <Input style={{ fontSize: "1.3rem" }} onChange={handleChangeLogin} type="password" name='password' value={valueLogin.password} placeholder="Enter Password" />
              <Input style={{ fontSize: "1.3rem", cursor: "pointer" }} type='submit' />
              <Security></Security>
            </form>
          </TabPanel>
          <TabPanel className={Style.form2}>
            <form onSubmit={handleSubmitSignup}>
              <p style={{ fontSize: "1.3rem" }}>Name</p>
              <Input style={{ fontSize: "1.3rem", borderColor: "green" }} onChange={handleChangeSignup} type="text" name='name' value={valueSignup.name} placeholder="Enter Name" />
              <p style={{ fontSize: "1.3rem" }}>Email</p>
              <Input style={{ fontSize: "1.3rem", borderColor: "green" }} onChange={handleChangeSignup} type="email" name='email' value={valueSignup.email} placeholder="Enter Email" />
              <p style={{ fontSize: "1.3rem" }}>Password</p>
              <Input style={{ fontSize: "1.3rem", borderColor: "green" }} onChange={handleChangeSignup} type="password" name='password' value={valueSignup.password} placeholder="Enter Password" />
              <p style={{ fontSize: "1.3rem" }}>Security Question</p>
              <Select name='securityQuestion' value={valueSignup.securityQuestion} onChange={handleChangeSignup} placeholder='Select a question of your choice' style={{ fontSize: "1.3rem" }}>
                <option value='What is the name of your pet ?'>What is the name of your pet ?</option>
                <option value='What is your favourite food ?'>What is your favourite food ?</option>
                <option value='What is your favourite place ?'>What is your favourite place ?</option>
              </Select>
              <p style={{ fontSize: "1.3rem" }}>Security Answer</p>
              <Input style={{ fontSize: "1.3rem", borderColor: "green" }} onChange={handleChangeSignup} type="password" name='securityAnswer' value={valueSignup.securityAnswer} placeholder="Security Answer" />
              <Input style={{ fontSize: "1.3rem", borderColor: "green", cursor: "pointer" }} type='submit' />
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  )
}

export default App
