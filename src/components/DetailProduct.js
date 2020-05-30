import React, { Component } from 'react';
import { Breadcrumb, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
})

class DetailProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			carts: [],
			productsByCategory: [],
			id: '',
			name: '',
			stok: '',
			berat_kemasan: '',
			harga_supplyer: '',
			harga_jual: '',
			satuan: '',
			expire: '',
			deskripsi: '',
			type: '',
			kategori_id: '',
			foto_1: null,
			foto_2: null,
			foto_3: null,
			modePenjualan: '',
			keranjangTotalHarga: 0
		}

		window.scrollTo(0,0);
	}	

	componentWillMount() {
		if(localStorage.getItem('cart') !== null)
	    	this.setState({
	    		carts: JSON.parse(localStorage.getItem('cart'))
	    	})

	    if(localStorage.getItem('keranjangTotalHarga') !== null)
	    	this.setState({
	    		keranjangTotalHarga: localStorage.getItem('keranjangTotalHarga')
	    	})

	    axios.get(`https://api.klikfood.id/config/mode`)
		  .then((response) => {
		  	this.setState({
		  		modePenjualan: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Gagal Mendapatkan mode Penjualan :(");
		  })
	}

	componentDidMount() {
		axios.get(`https://api.klikfood.id/index.php/kategori`)
		  .then((response) => {
		  	this.setState({
		  		categories: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Something Went Wrong :(");
		  })

		  axios.defaults.headers = {  
			'Authorization': sessionStorage.api_token 
			}

		 axios.get(`https://api.klikfood.id/index.php/mitra/produk/show/`+this.props.match.params.id)
		  .then((response) => {
		  	console.log(response);
		  	this.setState({
		  		id: response.data.data._id,
		  		name: response.data.data.name,
		  		stok: response.data.data.stok,
		  		berat_kemasan: response.data.data.berat_kemasan,
		  		harga_supplyer: response.data.data.harga_supplyer,
		  		harga_jual: response.data.data.harga_jual,
		  		satuan: response.data.data.satuan,
		  		expire: response.data.data.expire,
		  		deskripsi: response.data.data.deskripsi,
		  		type: response.data.data.type,
		  		kategori_id: response.data.data.kategori_id,
		  		foto_1: response.data.data.foto_1,
		  		foto_2: response.data.data.foto_2,
		  		foto_3: response.data.data.foto_3
		  	})
		  	axios.get(`https://api.klikfood.id/mitra/produk?type=verify&kategori=`+this.state.kategori_id+`&limit=4`)
	  		  .then((response) => {
	  		  	console.log(response.data.data)
	  		  	console.log(this.state.kategori_id)
	  		  	this.setState({
	  		  		productsByCategory: response.data.data
	  		  	})
	  		  }).catch((error) => {
	  		  	toast.error("Gagal Mendapatkan Info Produk :(");
	  		  })
		  }).catch((error) => {
		  	toast.error("Something Went Wrong :(");
		  })
	}

	handleAddToCart = (e) => {
    	e.preventDefault();
		this.state.carts.push([this.state.name, this.state.harga_jual, this.state.id+"/"+this.state.foto_1, 1, this.state.berat_kemasan]);
	    
	    localStorage.setItem('cart', JSON.stringify(this.state.carts));

	    const sebelumTotalHarga = Number(this.state.keranjangTotalHarga) + Number(this.state.harga_jual);
		
	    this.setState({
	    	keranjangTotalHarga: sebelumTotalHarga
	    })

		localStorage.setItem('keranjangTotalHarga', sebelumTotalHarga);
		toast.success("Berhasil Dimasukkan Keranjang !");
	}

	handlePay = (e) => {
		if (sessionStorage.length === 0) {
			{toast.warning("Login Terlebih Dahulu !")}
			window.location.href='/login';
	    }else{
	    	e.preventDefault();
			this.state.carts.push([this.state.name, this.state.harga_jual, this.state.id+"/"+this.state.foto_1, 1, this.state.berat_kemasan]);

		    localStorage.setItem('cart', JSON.stringify(this.state.carts));
		    console.log(JSON.stringify(this.state.carts));
		    console.log(JSON.parse(localStorage.getItem('cart')));
			toast.success("Berhasil Dimasukkan Keranjang !");
	    	window.location.href='/cart';
	    }
	}

	handleAddToCartProductCategory = (e) => {
    	e.preventDefault();
		this.state.carts.push([e.target.title, e.target.lang, e.target.id, 1, e.target.accessKey]);
	    
	    localStorage.setItem('cart', JSON.stringify(this.state.carts));

	    const sebelumTotalHarga = Number(this.state.keranjangTotalHarga) + Number(e.target.lang);
		
	    this.setState({
	    	keranjangTotalHarga: sebelumTotalHarga
	    })

		localStorage.setItem('keranjangTotalHarga', sebelumTotalHarga);
		toast.success("Berhasil Dimasukkan Keranjang !");
	}

	render() {
		return (
			<div>
				<section>
			          <div className="container">
						<Breadcrumb>
						  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
						  <Breadcrumb.Item active>Detail</Breadcrumb.Item>
						</Breadcrumb>
						<Card style={{ width: '100%' }}>
						  <Card.Header style={{padding:'50px'}}>
						  	<Row>
							    <Col md={6}>
							    	    <div className="row">
							    	      <div className="col-sm-12">
							    	        <div id="slider-carousel" className="carousel slide" data-ride="carousel">
							    	          <ol className="carousel-indicators">
		    		          			 			<React.Fragment>
								          				{ (this.state.foto_1 !== null) ?
								          				<li data-target="#slider-carousel" data-slide-to={0} className="active" />
								          				: null
								          				}
								          				{ (this.state.foto_2 !== null) ?
								          				<li data-target="#slider-carousel" data-slide-to={1} />
								          				: null
								          				}
								          				{ (this.state.foto_3 !== null) ?
								          				<li data-target="#slider-carousel" data-slide-to={2} />
								          				: null
								          				}
								          			</React.Fragment>
							    		        </ol>
							    	          <div className="carousel-inner">
			    	          					{ (this.state.foto_1 !== null) ?
							          			<React.Fragment>
										            <div className="item active">
										              <div className="col-sm-12">
										                <img src={"https://api.klikfood.id/uploads/produk/"+this.state.id+"/"+this.state.foto_1} className="girl img-responsive" alt />
										              </div>
										            </div>
									        	</React.Fragment> : null
									    		}
									    		{ (this.state.foto_2 !== null) ?
									        	<React.Fragment>
									        		<div className="item">
										              <div className="col-sm-12">
										                <img src={"https://api.klikfood.id/uploads/produk/"+this.state.id+"/"+this.state.foto_2} className="girl img-responsive" alt />
										              </div>
										            </div>
									       		</React.Fragment> : null
									       		}
									       		{ (this.state.foto_3 !== null) ?
									        	<React.Fragment>
									        		<div className="item">
										              <div className="col-sm-12">
										                <img src={"https://api.klikfood.id/uploads/produk/"+this.state.id+"/"+this.state.foto_3} className="girl img-responsive" alt />
										              </div>
										            </div>
									       		</React.Fragment> : null
											    }
							    	          </div>
							    	          <a href="#slider-carousel" className="left control-carousel hidden-xs" data-slide="prev">
							    	            <i className="fa fa-angle-left" />
							    	          </a>
							    	          <a href="#slider-carousel" className="right control-carousel hidden-xs" data-slide="next">
							    	            <i className="fa fa-angle-right" />
							    	          </a>
							    	        </div>
							    	      </div>
							    	    </div>
							    </Col>
							    <Col md={6}>
							    	<h2>{ this.state.name }</h2>
							    	<h3 style={{color: 'red'}}>{ formatter.format(this.state.harga_jual) + ' / ' + this.state.satuan }</h3>
							    	<p>{ this.state.deskripsi }</p>
							    	<button className="btn btn-success" onClick={this.handleAddToCart}>Tambahkan Ke Keranjang </button>
							    	<button className="btn btn-default" onClick={this.handlePay}>Pesan Sekarang </button>
							    </Col>
							</Row>
						  </Card.Header>
						</Card>
						<h2 className="title text-center">Produk Lainnya</h2>
						  {this.state.productsByCategory.map((product,i) =>
		                	<React.Fragment>
	    		                      		                
	                            <div className="col-xs-6 col-sm-3">
		                          <div className="product-image-wrapper">
		                            <div className="single-products">
		                              <div className="productinfo text-center">
		                                <a href={"/product/"+product._id}><img src={"https://api.klikfood.id/uploads/produk/"+product._id+"/"+product.foto_1} style={{maxHeight: '150px'}} alt /></a>											
		                                <h2 className="homePriceProduk">{ formatter.format(product.harga_jual) + ' / ' + product.satuan }</h2>
		                                <p className="homeNameProduk">{ product.name }</p>
		                              	{
		                                	(this.state.modePenjualan.value === 1) ?
		                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" />Lihat</Link>
		                                	: 
		                                	<a href="#" accesskey={product.berat_kemasan} onClick={this.handleAddToCartProductCategory} id={product._id + "/" + product.foto_1} title={product.name} lang={product.harga_jual} className="btn btn-default add-to-cart"><i accesskey={product.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={product._id + "/" + product.foto_1} title={product.name} lang={product.harga_jual} />Beli</a>	
		                                }
		                              </div>
		                            </div>
		                          </div>
		                        </div>

		                	</React.Fragment>
						)}
					  </div>
				</section>
				<div style={{
	                position: 'fixed',
	                left: 0,
	                bottom: 0,
	                width: '100%',
	                height: '50px',
	                backgroundColor: '#16e02e',
	                color: 'white',
	                zIndex: '99999999'
	            }}>
	            <div className="row">
	                <div className="container">
	                  <div className="col-md-4 col-xs-3">
	                    <h2 className="fa fa-shopping-cart" style={{marginTop: '11px'}}> <span style={{fontSize: '2rem'}}>Total Keranjang</span></h2>
	                  </div>
	                  <div className="col-md-7 col-xs-6">
	                    <h2 style={{marginTop: '10px', color: '#f44336', fontSize: '3rem'}}>{ formatter.format(this.state.keranjangTotalHarga) }</h2>
	                  </div>
	                  <div className="col-md-1 col-xs-3">
	                    <a href="/cart" className="btn btn-success" style={{marginTop: '10px'}}> Lanjut</a>
	                  </div>
	                </div>
	            </div>
	            </div>
				<FooterTop />
				<FooterBottom />
			</div>
		);
	}
}
export default DetailProduct;