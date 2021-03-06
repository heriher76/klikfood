import React, { Component } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

class SliderShow extends Component {
	constructor(props) {
		super(props);
		this.state = {
			idSlider: '',
			judul: '',
			subjudul: '',
			keterangan: '',
			image: null,
			submitting: false
		}
	}

	componentWillMount() {
		axios.defaults.headers = {  
			'Authorization': sessionStorage.api_token 
		}
		axios.get(`https://api.klikfood.id/index.php/slider/show/`+this.props.match.params.id)
	  .then((response) => {
	  	console.log(response.data.data);
	  	this.setState({
	  		idSlider: response.data.data._id,
	  		judul: response.data.data.judul,
	  		subjudul: response.data.data.subjudul,
	  		keterangan: response.data.data.keterangan,
	  		image: response.data.data.image
	  	})
	  }).catch((error) => {
	  	toast.error("Something Went Wrong :(");
	  });
	}

	handleChange = (event) => {
		this.setState({ 
			[event.target.name]: event.target.value
		})
	}

	handleChangeImage = (e) => {
		this.setState({image:e.target.files[0]})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({
			submitting: true
		})
		const bodyFormData = new FormData();
		
		bodyFormData.set('judul', this.state.judul);
		bodyFormData.set('subjudul', this.state.subjudul);
		bodyFormData.set('keterangan', this.state.keterangan);
		bodyFormData.append('image', this.state.image);

		axios.defaults.headers = {  
			'Content-Type': 'multipart/form-data',  
			'Authorization': sessionStorage.api_token 
		}
		console.log(bodyFormData);
		axios.post(`https://api.klikfood.id/index.php/slider/update/`+this.props.match.params.id, bodyFormData)
	      .then(response => {
	      	this.setState({
				submitting: true
			})
	      	toast.success("Slider Diperbarui !");
	      	setTimeout(() => {
	      		window.location.href='/admin/sliders';
	      	}, 3000)
	      }).catch(err => {
	      	this.setState({
				submitting: false
			})
	      	toast.error("Tidak Bisa Memperbarui Slider :( ");
	      });
	}

	render() {
		return (
			<div>
				<ToastContainer />
				<div classname="row clearfix">
				    <div classname="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				        <div classname="card">
				            <div classname="header">
				              <h2>
				                Detail Slider
				              </h2>
				            </div>
				            <div classname="body">
				        		<Form onSubmit={this.handleSubmit} >
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Judul
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Judul" name="judul" value={this.state.judul} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Sub Judul
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Sub Judul" name="subjudul" value={this.state.subjudul} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Keterangan
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Keterangan" name="keterangan" value={this.state.keterangan} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>

				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Upload Gambar
				        		    </Form.Label>
				        		    <Col sm={5}>
				        		    {
				        		    	(this.state.image) ? <img height="150px" src={"http://bajax.0hi.me/slider/"+this.state.idSlider+"/"+this.state.image} /> : null
				        		    }
				        		      <Form.Control type="file" name="image" onChange={this.handleChangeImage} />
				        		    </Col>
				        		  </Form.Group>

				        		  <Form.Group as={Row}>
				        		    <Col sm={{ span: 10, offset: 2 }}>
				        		      {this.state.submitting ?
										<div>
											<b><center>Sedang Upload...</center></b>
										</div>
										:
											<Button type="submit" className="btn btn-success">Submit</Button>
										}
				        		    </Col>
				        		  </Form.Group>
				        		</Form>;
				            </div>
				        </div>
				    </div>
				</div>
			</div>
		);
	}
}
export default SliderShow;