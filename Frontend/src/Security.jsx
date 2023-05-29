import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
} from '@chakra-ui/react'

const Security = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [securityQuestion, setSecurityQuestion] = React.useState(false)
    const [valueEmail, setValueEmail] = React.useState({
        email: ""
    })
    const [value, setValue] = React.useState({
        email: "",
        password: "",
        securityAnswer: ""
    })
    const handleChangeEmail = (e) => {
        let name = e.target.name;
        let values = e.target.value;
        setValueEmail({
            ...valueEmail,
            [name]: values
        });
    }
    const handleChange = (e) => {
        let name = e.target.name;
        let values = e.target.value;
        setValue({
            ...value,
            [name]: values
        });
    }
    const handlePassword = async(event) => {
        event.preventDefault();
        let res = await fetch("https://forgetpassword-backend.onrender.com/user/forgetPassword", {
            method: "POST",
            body: JSON.stringify(value),
            headers: {
                "Content-type": "application/json"
            }
        })
        let data = await res.json();
        if (data.msg === "Wrong Security Answer") {
            alert("Wrong Security Answer");
            return;
        }else{
            alert("Password changed successfully");
        }
        setValue({
            email: "",
            password: "",
            securityAnswer: ""
        })
    }
    const handleGetQuestion = async(event) => {
        event.preventDefault();
        let res = await fetch("https://forgetpassword-backend.onrender.com/user/getQuestion", {
            method: "POST",
            body: JSON.stringify(valueEmail),
            headers: {
                "Content-type": "application/json"
            }
        })
        let data = await res.json();
        if (data.msg === "Email not found") {
            alert("Email not found");
            return;
        }else{
            alert("Security question acquired");
        }
        localStorage.setItem("email", data.email)
        setValue({email:data.email,
                password: "",
                securityAnswer: ""})
        setSecurityQuestion(data.SQ)
        setValueEmail({
            email: ""
        })
    }
    return (
        <>
            <Button style={{ fontSize: "1.3rem",marginTop:"1rem",backgroundColor:"rgb(82, 82, 226)",color:"white" }} onClick={onOpen}>Forget Password</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reset Password</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p style={{ fontSize: "1.3rem" }}>Email</p>
                        <Input style={{ fontSize: "1.3rem" }} onChange={handleChangeEmail} type="email" name='email' value={valueEmail.email} placeholder="Enter your Email" />
                        <Button style={{ fontSize: "1.3rem", marginTop: "1rem" }} onClick={handleGetQuestion}>Get the security question</Button>
                        {securityQuestion ? (<div>
                            <p style={{ fontSize: "1.3rem", marginTop: "1rem" }}>{securityQuestion}</p>
                            <Input style={{ fontSize: "1.3rem" }} onChange={handleChange} type="text" name='securityAnswer' value={value.securityAnswer} placeholder="Answer the question" />
                            <p style={{ fontSize: "1.3rem" }}>New Password</p>
                            <Input style={{ fontSize: "1.3rem" }} onChange={handleChange} type="password" name='password' value={value.password} placeholder="Enter new password" />
                            <Button style={{ fontSize: "1.3rem" }} onClick={handlePassword}>Set New Password</Button>
                        </div>) : (null)}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Security