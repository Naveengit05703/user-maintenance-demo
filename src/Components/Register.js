import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { addUser } from "../Redux/actions/userActions";
import ModalComponent from "./UI/ModalComponent";
import { connect } from "react-redux";

const initialUserData = {
  fname: "",
  lname: "",
  dob: "",
  age: "",
  gender: "",
  status: false,
};

const Register = ({ userData, addUser }) => {
  const [newUser, setnewUser] = useState(initialUserData);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const confirmAdd = () => {
    newUser.dob && calculateAge(newUser.dob);
    fetch(`http://localhost:3001/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: newUser.fname,
        lname: newUser.lname,
        dob: newUser.dob,
        age: newUser.age,
        gender: newUser.gender,
        status: newUser.status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        addUser(data);
        setShowAddModal(false);
        setnewUser(initialUserData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
    const month_diff = Date.now() - dob.getTime();
      
    //convert the calculated difference in date format  
    const age_dt = new Date(month_diff);   
      
    //extract year from date      
    const year = age_dt.getUTCFullYear();  
      
    //now calculate the age of the user  
    setnewUser({ ...newUser, age: Math.abs(year - 1970)})
  };

  const validateForm = (formObject) => {
    const alfaNumericRegex = /^[a-z0-9]+$/i;
    const isValidFirstName = alfaNumericRegex.test(formObject.fname);
    const isValidAge = Number.isNaN(formObject.age);
    return isValidFirstName
  };

  return (
    <>
      <Col>
        <Button variant="outline-primary" className="pe-none">
        All Users <span className="badge bg-secondary">{userData.length}</span>
        </Button>
      </Col>
      <Col className="text-end">
        <Button variant="primary" onClick={handleAdd}>
          Add
        </Button>
      </Col>

      {showAddModal && (
        <ModalComponent
          showModal={showAddModal}
          setShowModal={setShowAddModal}
          confirmAction={confirmAdd}
          title="Registration"
          content={
            <NewUserFormComponent newUser={newUser} setnewUser={setnewUser} />
          }
          confirmButtonText="Update"
          cancelButtonText="Cancel"
          isConfirmDisabled={
            newUser.fname === "" ||
            !validateForm(newUser)
          }
        />
      )}
    </>
  );
};

const NewUserFormComponent = ({ newUser, setnewUser }) => {
  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>First Name<sup className="red-text">*</sup></Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            name="fname"
            value={newUser.fname}
            onChange={(e) => setnewUser({ ...newUser, fname: e.target.value })}
            required
          /><Form.Control.Feedback type="invalid">First name is required</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            name="lname"
            value={newUser.lname}
            onChange={(e) => setnewUser({ ...newUser, lname: e.target.value })}            
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            placeholder="Date of Birth"
            name="dob"
            value={newUser.dob}
            onChange={(e) => {
              setnewUser({ ...newUser, dob: e.target.value })
            }
          }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            placeholder="Age"
            name="age"
            value={newUser.age}            
            disabled
          >            
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={newUser.gender}
            onChange={(e) =>
              setnewUser({
                ...newUser,
                gender: e.target.value,
              })
            }
          >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>      
          </Form.Control>
        </Form.Group>   
        <Form.Group className="mb-3">
        <Form.Check.Label>Status</Form.Check.Label>
        <Form.Check 
                type="checkbox">
                    <Form.Check.Input
                        type={"checkbox"}
                        name="status"
                        defaultChecked={newUser.status}
                        onClick={(e) =>
                          setnewUser({
                              ...newUser,
                              status: e.target.checked,
                            })
                          }
                        />{' Active'}
            </Form.Check>     

        </Form.Group>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.user.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (data) => dispatch(addUser(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
