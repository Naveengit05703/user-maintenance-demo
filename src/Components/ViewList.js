import React, { useEffect, useState } from "react";
import {
  deleteUser,
  fetchAllUsers,
  updateUser,
} from "../Redux/actions/userActions";
import { connect } from "react-redux";
import { Col, Container, Row, Table, Form, Button } from "react-bootstrap";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import ModalComponent from "./UI/ModalComponent";
import Register from "./Register";

const ViewList = ({ userData, fetchAllUsers, deleteUser, updateUser }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getAllUsers();
  }, []);

  // on clicking delete icon
  const handleDelete = (userInfo) => {
    setShowDeleteModal(true);
    setSelectedUser(userInfo);
  };

  // on clicking edit icon
  const handleEdit = (userInfo) => {
    setShowEditModal(true);
    setSelectedUser(userInfo);
  };

  // fetch all user list
  const getAllUsers = () => {
    fetch("http://localhost:3001/users")
      .then((response) => response.json())
      .then((data) => fetchAllUsers(data))
      .catch((error) => console.log(error));
  };

  // clicking confirm delete on modal
  const confirmDelete = () => {
    fetch(`http://localhost:3001/users/${selectedUser.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok === true) {
          deleteUser(selectedUser.id);
        }
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  // clicking confirm update on modal
  const confirmUpdate = () => {
    const age = selectedUser.dob && calculateAge(selectedUser.dob);
    fetch(`http://localhost:3001/users/${selectedUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: selectedUser.fname,
        lname: selectedUser.lname,
        dob: selectedUser.dob,
        age: age,
        gender: selectedUser.gender,
        status: selectedUser.status,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        updateUser(selectedUser.id, data);
        setShowEditModal(false);
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
    return Math.abs(year - 1970);
  };

  // function to validate emil address
  const validateForm = (formObject) => {
    const alfaNumericRegex = /^[a-z0-9]+$/i;
    const isValidFirstName = alfaNumericRegex.test(formObject.fname);
    return isValidFirstName;
  };

  return (
    <>
      <Container>
        <Row className="py-5 mt-5">
          <Register />
        </Row>
        <Row>
          <Col>
            <Table hover responsive="sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Date of Birth</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((ele, index) => (
                  <tr key={ele.id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{ele.fname}</td>
                    <td className="fw-bold">{ele.lname}</td>
                    <td>{ele.dob}</td>
                    <td>{ele.age}</td>
                    <td>{ele.gender}</td>
                    <td
                      className={`fw-bold ${
                        ele.status ? "text-success" : "text-danger"
                      }`}
                    >
                      {ele.status}
                      {ele.status ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <Row>
                        <Col>
                          <AiFillEdit
                            onClick={() => handleEdit(ele)}
                            color="dodgerblue"
                            role="button"
                          />
                        </Col>
                        <Col>
                          <AiFillDelete
                            onClick={() => handleDelete(ele)}
                            color="red"
                            role="button"
                          />
                        </Col>
                      </Row>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      {showDeleteModal && (
        <ModalComponent
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          confirmAction={confirmDelete}
          title="Delete User"
          content="Are you sure you want to delete this user ?"
          confirmButtonText="Confirm"
          cancelButtonText="Cancel"
        />
      )}

      {showEditModal && (
        <ModalComponent
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          confirmAction={confirmUpdate}
          title="Edit User"
          content={
            <FormComponent
              selecteduser={selectedUser}
              setselecteduser={setSelectedUser}
            />
          }
          confirmButtonText="Update"
          cancelButtonText="Cancel"
          isConfirmDisabled={
            selectedUser.fname === "" || !validateForm(selectedUser)
          }
        />
      )}
    </>
  );
};

const FormComponent = ({ selecteduser, setselecteduser }) => {
  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="number"
            placeholder="name@example.com"
            value={selecteduser.id}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="First Name"
            name="fname"
            value={selecteduser.fname}
            onChange={(e) =>
              setselecteduser({ ...selecteduser, fname: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Last Name"
            name="lname"
            value={selecteduser.lname}
            onChange={(e) =>
              setselecteduser({ ...selecteduser, lname: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            placeholder="Date-of-Birth"
            name="dob"
            value={selecteduser.dob}
            onChange={(e) =>
              setselecteduser({ ...selecteduser, dob: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            placeholder="Age"
            name="age"
            value={selecteduser.age}
            onChange={(e) =>
              setselecteduser({ ...selecteduser, age: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Control
            as="select"
            name="gender"
            value={selecteduser.gender}
            onChange={(e) => {
              setselecteduser({
                ...selecteduser,
                gender: e.target.value,
              });
            }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check.Label>Status</Form.Check.Label>
          <Form.Check type="checkbox">
            <Form.Check.Input
              type={"checkbox"}
              name="status"
              defaultChecked={selecteduser.status}
              onClick={(e) =>
                setselecteduser({
                  ...selecteduser,
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
    fetchAllUsers: (data) => dispatch(fetchAllUsers(data)),
    deleteUser: (id) => dispatch(deleteUser(id)),
    updateUser: (id, data) => dispatch(updateUser(id, data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewList);
