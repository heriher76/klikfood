import React, { Component } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import qs from 'qs';
import { Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';

export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			address: '',
			detail_address: '',
			no_tlp: '',
			roles: '',
			username: '',
			user: [],
			updating: false,
			header: null
		}
	}

	componentWillMount() {
		axios.defaults.headers = {  
			'Authorization': sessionStorage.api_token 
		}

		axios.get(`https://api.klikfood.id/index.php/myaccount`)
	      .then(response => {
	      	console.log(response.data.data);
	      	// document.getElementById("from_places").defaultValue = response.data.data.address;
	      	this.setState({
	      		name: response.data.data.name,
				email: response.data.data.email,
				address: response.data.data.address,
				detail_address: response.data.data.detail_address,
				no_tlp: response.data.data.no_tlp,
				roles: response.data.data.roles,
				username: response.data.data.username
	      	})
	      }).catch(err => {
	      	toast.error("Gagal Mengambil Info :( ");
	      });
	}

	handleChange = (event) => {
		this.setState({ 
			[event.target.name]: event.target.value
		})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({
			updating: true
		})

		const data = { 
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			address: this.state.address,
			detail_address: this.state.detail_address,
			no_tlp: this.state.no_tlp,
			username: this.state.username,
			roles: sessionStorage.role
		}

		axios.defaults.headers = {  
			'Authorization': sessionStorage.api_token 
		}
		console.log(data);
		axios.patch(`https://api.klikfood.id/index.php/account`+"?"+qs.stringify(data))
	      .then(response => {
	      	sessionStorage.setItem('kota', data.address);
	      	this.setState({
				updating: true
			})
	      	toast.success("Update Akun Sukses !");
	      	setTimeout(() => {
	      		window.location.href='/profile';
	      	}, 2000)
	      }).catch(err => {
	      	this.setState({
				updating: false
			})
	      	toast.error("Gagal Update Akun :( ");
	      });
	}

	render() {
		if (sessionStorage.length === 0) {
			{toast.success("Login Terlebih Dahulu !")}
			return (
				<Redirect to={'/login'}/>
			)
	    }

		return (
			<div> 
				<ToastContainer />
				<section style={{ marginBottom: '50px', marginLeft: '30px' }}>{/*form*/}
			        <div className="container">
			            	<div classname="header">
				              <center><h2>
				                Update Profile
				              </h2></center>
				            </div>
				            <div classname="body">
				        		<Form onSubmit={this.handleSubmit} id="distance_form">
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Name
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Name" name="name" value={this.state.name} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Kota
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      {/*<Form.Control type="text" id="from_places" placeholder="Kota" name="address" onChange={this.handleChange} required />
				        		      <input id="origin" name="address" onChange={this.handleChange} required="" type="hidden" />*/}
				        		      <select name="address" onChange={this.handleChange} className="form-control" required>
										<option>Pilih Kota:</option>
										<option value="Jakarta Selatan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta, Indonesia">Jakarta Selatan</option>
										<option value="Jakarta Utara, Kota Jakarta Utara, Daerah Khusus Ibukota Jakarta, Indonesia">Jakarta Utara</option>
										<option value="Jakarta Pusat, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta, Indonesia">Jakarta Pusat</option>
										<option value="Jakarta Barat, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta, Indonesia">Jakarta Barat</option>
										<option value="Jakarta Timur, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta, Indonesia">Jakarta Timur</option>
										<option value="Bogor, Jawa Barat, Indonesia">Bogor</option>
										<option value="Depok, Kota Depok, Jawa Barat, Indonesia">Depok</option>
										<option value="Tangerang, Kota Tangerang, Banten, Indonesia">Tangerang</option>
										<option value="Bekasi, Kota Bekasi, Jawa Barat, Indonesia">Bekasi</option>
									  </select>
									  <br />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Alamat Detail 
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Alamat" name="detail_address" value={this.state.detail_address} onChange={this.handleChange} required />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Username
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Ganti Email ? *harus verifikasi kembali
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      No Handphone
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="No Telepon" name="no_tlp" value={this.state.no_tlp} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>

				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Ganti Password ? *opsional
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="password" placeholder="Password" name="password" value={this.state.password} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>

				        		  <Form.Group as={Row}>
				        		    <Col sm={{ span: 10, offset: 2 }}>
				        		    	{this.state.updating ?
										<div>
											<b><center>Updating...</center></b>
										</div>
										:
											<button type="submit" className="btn btn-primary">Update</button>
										}
				        		    </Col>
				        		  </Form.Group>
				        		</Form>;
				         </div>    
				    </div>
				</section>
				<footer id="footer">
			      	<FooterTop />
			      	<FooterBottom />
			      </footer>
			</div>
		);
	}
}
