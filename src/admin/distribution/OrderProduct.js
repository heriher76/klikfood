import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class OrderProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			produk: []
		}
		this.handleChange = this.handleChange.bind(this);
		localStorage.clear();
	}

	handleChange(event) {
		this.setState({ 
			[event.target.name]: event.target.value
		})
	}
	
	handleNextStep = (e) => {
		e.preventDefault();
		console.log(localStorage);
		// console.log(localStorage.getItem('product0').indexOf(','));
		let productSubmit = [];
		let validProduct = [];
		for(var i=0; i < this.state.products.length; i++) {
			if(localStorage.getItem('product'+i) !== null) {
				if (localStorage.getItem('product'+i).indexOf(',') > -1)
				{
					validProduct[i] = JSON.parse(localStorage.getItem('product'+i));
					if(validProduct[i][1] !== '')
						productSubmit[i] = JSON.parse(localStorage.getItem('product'+i));
				}
			}
		}
		localStorage.setItem('mitraCart', JSON.stringify(productSubmit.filter(n => n)));
		localStorage.setItem('redirectOnce', true);
		window.location.href='/admin/distribution/order/courier';
		console.log(localStorage);
	}

	componentDidMount() {
		axios.get(`https://api.klikfood.id/index.php/produksupplyer/all?type=verify`, { 'headers': { 'Authorization': sessionStorage.api_token } })
		  .then((response) => {
		  	console.log(response.data.data);
		  	this.setState({
		  		products: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Something Went Wrong :(");
		  });

	}

	indexN(cell, row, enumObject, index) {
	    return (<div>{index+1}</div>) 
	}

	showLayout(cell, row){
		const id = row._id;
	  	return (
	  		<Link to={"/admin/distribution/order/" + id} className="btn btn-success">Lihat</Link>
	  	)
	}
	
	jumlahLayout(cell, row){
		const id = row._id;
		
		// localStorage.setItem("product"+row.index, row._id);
		
		// let initiateItem = [...Array(150)].map( x => Array(2).fill(0) );
		
		// for(var i=0; i<=row.index; i++){
		// 	initiateItem[i][0] = localStorage.getItem("product"+i);
		// 	initiateItem[i][1] = 0;
		// }
		// const newInitiateItem = initiateItem.slice();
		
	  	return (
	  		<div className="cart_quantity_button">
	  		  <input className="cart_quantity_input" type="number" onChange={e => {	  		  	
				e.preventDefault();
				localStorage.setItem('product'+row.index, JSON.stringify([row._id, e.target.value]));
				
				console.log(localStorage);
	  		  } } name="quantity" autoComplete="off" />
	  		</div>
	  	)
	}

	render() {
		return (
			<div>
			<ToastContainer />
				<div className="row clearfix">
				  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				    <div className="card">
				      <div className="header">
				        <h2>
				          Product List
				        </h2>
				      </div>
				      <div className="body">
				        <div className="table-responsive">
				        	<BootstrapTable data={this.state.products} striped search pagination hover>
	                  		  <TableHeaderColumn dataField='id' isKey={ true } hidden>User ID</TableHeaderColumn>
				        	  <TableHeaderColumn dataField="any" dataFormat={this.indexN} width='80'>No</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='name' dataSort={true}>Name</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='stok' dataSort={true}>Stok</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='berat_kemasan' dataSort={true}>Berat Kemasan</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='expire' dataSort={true}>Kadaluarsa</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='harga_supplyer' dataSort={true}>Harga Pemasok</TableHeaderColumn>
		                  	  <TableHeaderColumn dataField='any' dataFormat={ this.showLayout }> </TableHeaderColumn>
		                  	  <TableHeaderColumn dataField='any' dataFormat={ this.jumlahLayout } width='150'>Jumlah </TableHeaderColumn>
		                  	</BootstrapTable>  
				        	<button className="btn btn-primary" onClick={this.handleNextStep}> Lanjutkan </button>
				        </div>
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
}
export default OrderProduct;