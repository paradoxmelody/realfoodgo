import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { useState } from "react";

export default function Basic() {
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);

  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#cf882bff" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100 text-center">
            <MDBCol>
              <MDBBtn color="light" size="lg" onClick={toggleShow}>
                <MDBIcon fas icon="info me-2" /> Get information
              </MDBBtn>
              <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
                <MDBModalDialog>
                  <MDBModalContent>
                    <MDBModalHeader className="border-bottom-0">
                      <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={toggleShow}
                      ></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody className="text-start text-black p-4">
                      <MDBTypography
                        tag="h5"
                        className="modal-title text-uppercase mb-5"
                        id="exampleModalLabel"
                      >
                        Johnatan Miller
                      </MDBTypography>
                      <MDBTypography
                        tag="h4"
                        className="mb-5"
                        style={{ color: "#c97911ff" }}
                      >
                        Thanks for your order
                      </MDBTypography>
                      <p className="mb-0" style={{ color: "#d88a24ff" }}>
                        Payment summary
                      </p>
                      <hr
                        className="mt-2 mb-4"
                        style={{
                          height: "0",
                          backgroundColor: "transparent",
                          opacity: ".75",
                          borderTop: "2px dashed #9e9e9e",
                        }}
                      />

                      <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Ether Chair(Qty:1)</p>
                        <p className="text-muted mb-0">$1750.00</p>
                      </div>

                      <div className="d-flex justify-content-between">
                        <p className="small mb-0">Shipping</p>
                        <p className="small mb-0">$175.00</p>
                      </div>

                      <div className="d-flex justify-content-between pb-1">
                        <p className="small">Tax</p>
                        <p className="small">$200.00</p>
                      </div>

                      <div className="d-flex justify-content-between">
                        <p className="fw-bold">Total</p>
                        <p className="fw-bold" style={{ color: "#d3770dff" }}>
                          $2125.00
                        </p>
                      </div>
                    </MDBModalBody>

                    <MDBModalFooter className="d-flex justify-content-center border-top-0 py-4">
                      <MDBBtn
                        size="lg"
                        style={{ backgroundColor: "#cc690dff" }}
                        className="mb-1"
                      >
                        Track your order
                      </MDBBtn>
                    </MDBModalFooter>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </>
  );
}