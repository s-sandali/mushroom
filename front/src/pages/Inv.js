import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import '../cssFiles/Inv.css';

export default function Inv() {

    const [Invs,setInvs]=useState([])

    useEffect(()=>{
      loadInvs();
    },[]);
        
        const loadInvs=async()=>{
        const result=await axios.get("http://localhost:8080/api/v2/getInvs");
        setInvs(result.data);
      };

      const deleteInv=async (nid)=> {
        await axios.delete(`http://localhost:8080/api/v2/deleteInv/${nid}`);
        loadInvs();
      };

    return (

      <div className="container">

      <div className="d-flex justify-content-between align-items-center mb-3 top-bar">
        <div className="btn-group" role="group" aria-label="Navigation Buttons">
          <Link to="/Inv" className="btn">Overall</Link>
          <Link to="/InvLab" className="btn">Lab</Link>
          <Link to="/InvSales" className="btn">Sales</Link>
          <Link to="/InvOther" className="btn">Other</Link>
        </div>
        <div className="text-muted">
          <medium>View inventory allocation by category</medium>
        </div>
     </div>

  <div className="table-container">
    <table className="table custom-table table-hover table-striped border shadow ">
      <thead>
        <tr>
          <th scope="col"  style={{color:" #354e2d"}}>#</th>
          <th scope="col"  style={{color:" #354e2d"}}>Material Name</th>
          <th scope="col"  style={{color:" #354e2d"}}>Usage Type</th>
          <th scope="col"  style={{color:" #354e2d"}}>Stock</th>
          <th scope="col"  style={{color:" #354e2d"}}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Invs.map((Inv, index) => (
          <tr key={Inv.nid}>
            <th scope="row">{index + 1}</th>
            <td>{Inv.material}</td>
            <td>{Inv.usageType}</td>
            <td>{Inv.used_stock}</td>
            <td>
              <Link
                className="btn btn-outline-success btn-sm custom-btn"
                to={`/EditInv/${Inv.nid}`}
              >
                Update
              </Link>
              <button
                className="btn btn-outline-danger btn-sm custom-btn"
                onClick={() => deleteInv(Inv.nid)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  )
}