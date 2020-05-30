import React, { Component } from 'react';
import Banner from './Banner';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';
import axios from 'axios';
import qs from 'qs';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
})

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			promoProducts: [],
			recommendProducts: [],
			newProducts: [],
			productsByCategory: [],
			carts: [],
			modePenjualan: '',
			emailSubscribe: '',
			keranjangTotalHarga: 0
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount() {
		axios.get(`https://api.klikfood.id/config/mode`)
		  .then((response) => {
		  	this.setState({
		  		modePenjualan: response.data.data.value
		  	})
		  }).catch((error) => {
		  	toast.error("Gagal Mendapatkan mode Penjualan :(");
		  })
		
		axios.get(`https://api.klikfood.id/index.php/mitra/produk?orderby=expire&limit=8&type=verify`)
		  .then((response) => {
		  	console.log(response.data.data)
		  	this.setState({
		  		promoProducts: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Gagal Mendapatkan Info Promo Produk :(");
		  })

		  axios.get(`https://api.klikfood.id/index.php/mitra/produk?orderby=terjual&limit=8&type=verify`)
		  .then((response) => {
		  	console.log(response.data.data)
		  	this.setState({
		  		recommendProducts: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Gagal Mendapatkan Info Produk Populer :(");
		  })

		  axios.get(`https://api.klikfood.id/index.php/mitra/produk?orderby=terbaru&limit=8&type=verify`)
		  .then((response) => {
		  	console.log(response.data.data)
		  	this.setState({
		  		newProducts: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Gagal Mendapatkan Info Produk Terbaru :(");
		  })

		  if(localStorage.getItem('cart') !== null)
	    	this.setState({
	    		carts: JSON.parse(localStorage.getItem('cart'))
	    	})

	      if(localStorage.getItem('keranjangTotalHarga') !== null)
	    	this.setState({
	    		keranjangTotalHarga: localStorage.getItem('keranjangTotalHarga')
	    	})
	}

	componentDidMount() {
	  axios.get(`https://api.klikfood.id/index.php/kategori`)
	  .then((response) => {
	  		console.log(response.data.data);
		  	this.setState({
		  		categories: response.data.data
		  	})
		  	let produkToKategori = [];
		  	this.state.categories.map((category,i) => 
		  		axios.get(`https://api.klikfood.id/mitra/produk?xkategori=`+category.kategori._id+`&limit=8&type=verify`)
		  		  .then((response) => {
		  		  	
		  		  	produkToKategori.push([category.kategori.name, response.data.data])
		  		  	console.log(produkToKategori);

		  		  	this.setState({
		  		  		productsByCategory: produkToKategori
		  		  	})
		  		  }).catch((error) => {
		  		  	toast.error("Gagal Mendapatkan Info Produk :(");
		  		  })
		  	);
		  }).catch((error) => {
		  	toast.error("Tidak Bisa Mendapatkan Kategori :(");
		  })
	}

	handleChange(event) {
		event.preventDefault();
		this.setState({ 
			[event.target.name]: event.target.value
		})
		console.log(localStorage)
	}

	handleSubscribe = (e) => {
		e.preventDefault();
		const bodyFormData = {
			email: this.state.emailSubscribe
		}
		axios.post(`https://api.klikfood.id/index.php/subscribe`, qs.stringify(bodyFormData))
	      .then(res => {
	      	toast.success("Terimakasih Sudah Subscribe !");
	      }).catch(err => {
	      	toast.error("Gagal Menghubungi Server :( ");
	      });
	}

	handleAddToCart = (e) => {
    	e.preventDefault();
		this.state.carts.push([e.target.title, e.target.lang, e.target.id, 1, e.target.accessKey]);

		const sebelumTotalHarga = Number(this.state.keranjangTotalHarga) + Number(e.target.lang);
		
	    this.setState({
	    	keranjangTotalHarga: sebelumTotalHarga
	    })
	    
	    localStorage.setItem('cart', JSON.stringify(this.state.carts));
	    // console.log(JSON.stringify(this.state.carts));
	    // console.log(JSON.parse(localStorage.getItem('cart')));
		localStorage.setItem('keranjangTotalHarga', sebelumTotalHarga);
		toast.success("Berhasil Dimasukkan Keranjang !");
	}

	render() {
		return (
			<div>
			<div className="row">
			  <div className="col-sm-6 col-xs-6">
			    <center>
			      <div className="price-range">{/*Jadi Mitra*/}
			        
		      		<React.Fragment>
		        		<center><a href="/register-mitra"><button type="button" className="btn get" style={{backgroundColor: '#16e02e', padding: '20px', borderRadius: '50%'}}><b><h4>JADI MITRA</h4></b></button></a></center><br />
		      		</React.Fragment>
		      	
			      </div>
			    </center>
			  </div>
			  <div className="col-sm-6 col-xs-6">
			    <center>
			      <div className="price-range">{/*Jadi Rekan*/}
			        
			        <React.Fragment>
		        		<center><a href="/register-pemasok"><button type="button" className="btn get" style={{backgroundColor: '#16e02e', padding: '20px', borderRadius: '50%'}}><b><h4>JADI PEMASOK</h4></b></button></a></center><br />
		      		</React.Fragment>

			      </div>
			    </center>
			  </div>		
			</div>			
	        <Banner />
			<section>
	          <div className="container">
	            <div className="row">
	              
	              <div className="col-sm-12 col-md-12">

	                <div className="recommended_items">{/*recommended_items*/}
	                  <h2 className="title text-center">Produk Promo</h2>
	                  {/*data-ride="carousel"*/}
	                  <div id="promo-item-carousel" className="carousel slide" style={{backgroundColor: '#F0F0E9', paddingTop: '10px'}}>
	                    <div className="carousel-inner">
	                      
	                      <div className="item active">
	                      {
	                      	this.state.promoProducts.map((item,i) => 
		                    
		                    	(i <= 3) ? 
	                				<React.Fragment>

				                        <div className={ ( i >= 2 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
				                          <div className="product-image-wrapper">
				                            <div className="single-products">
				                              <div className="productinfo text-center">
				                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
				                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
				                                <p className="homeNameProduk">{ item.name }</p>
				                                {
				                                	(this.state.modePenjualan.value === 1) ?
				                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
				                                	: 
				                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
				                                }
				                              </div>
				                            </div>
				                          </div>
				                        </div>
				                    </React.Fragment> 	
			                    : null
		                    )
	                      }
	                      </div>

	                      <div className="item">
	                      {
	                      	this.state.promoProducts.map((item,i) => 
		                    
		                    	(i > 3 && i <= 7) ? 
	                				<React.Fragment>
				                        <div className={ ( i >= 6 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
				                          <div className="product-image-wrapper">
				                            <div className="single-products">
				                              <div className="productinfo text-center">
				                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
				                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
				                                <p className="homeNameProduk">{ item.name }</p>
				                              	{
				                                	(this.state.modePenjualan.value === 1) ?
				                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
				                                	: 
				                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
				                                }
				                              </div>
				                            </div>
				                          </div>
				                        </div>
				                    </React.Fragment> 	
			                    : null
		                    )
	                      }
	                      </div> 

	                    </div>
	                    <a className="left recommended-item-control" href="#promo-item-carousel" data-slide="prev">
	                      <i className="fa fa-angle-left" />
	                    </a>
	                    <a className="right recommended-item-control" href="#promo-item-carousel" data-slide="next">
	                      <i className="fa fa-angle-right" />
	                    </a>			
	                  </div>
	                </div>{/*/recommended_items*/}
	                <br />
	                <div className="recommended_items">{/*new_items*/}
	                  <h2 className="title text-center">Produk Terbaru</h2>
	                  <div id="new-item-carousel" className="carousel slide">
	                    <div className="carousel-inner">
	                    
	                    <div className="item active">
	                      {
	                      	this.state.newProducts.map((item,i) => 
		                    
		                    	(i <= 3) ? 
	                				<React.Fragment>
				                        <div className={ ( i >= 2 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
				                          <div className="product-image-wrapper">
				                            <div className="single-products">
				                              <div className="productinfo text-center">
				                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
				                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
				                                <p className="homeNameProduk">{ item.name }</p>
				                              	{
				                                	(this.state.modePenjualan.value === 1) ?
				                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
				                                	: 
				                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
				                                }
				                              </div>
				                            </div>
				                          </div>
				                        </div>
				                    </React.Fragment> 	
			                    : null
		                    )
	                      }
	                      </div>

	                      <div className="item">
	                      {
	                      	this.state.newProducts.map((item,i) => 
		                    
		                    	(i > 3 && i <= 7) ? 
	                				<React.Fragment>
				                        <div className={ ( i >= 6 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
				                          <div className="product-image-wrapper">
				                            <div className="single-products">
				                              <div className="productinfo text-center">
				                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
				                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
				                                <p className="homeNameProduk">{ item.name }</p>
				                              	{
				                                	(this.state.modePenjualan.value === 1) ?
				                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
				                                	: 
				                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
				                                }
				                              </div>
				                            </div>
				                          </div>
				                        </div>
				                    </React.Fragment> 	
			                    : null
		                    )
	                      }
	                      </div> 

	                    </div>
	                    <a className="left recommended-item-control" href="#new-item-carousel" data-slide="prev">
	                      <i className="fa fa-angle-left" />
	                    </a>
	                    <a className="right recommended-item-control" href="#new-item-carousel" data-slide="next">
	                      <i className="fa fa-angle-right" />
	                    </a>			
	                  </div>
	                </div>{/*/new_items*/}

	                <div className="recommended_items">
	                  <h2 className="title text-center">Rekomendasi Produk</h2>
	                  <div id="recommended-item-carousel" className="carousel slide">
	                    <div className="carousel-inner">
	                      	<div className="item active">
	                      {
	                      	this.state.recommendProducts.map((item,i) => 
		                    
		                    	(i <= 3) ? 
	                				<React.Fragment>
				                        <div className={ ( i >= 2 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
				                          <div className="product-image-wrapper">
				                            <div className="single-products">
				                              <div className="productinfo text-center">
				                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
				                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
				                                <p className="homeNameProduk">{ item.name }</p>
				                              	{
				                                	(this.state.modePenjualan.value === 1) ?
				                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
				                                	: 
				                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
				                                }
				                              </div>
				                            </div>
				                          </div>
				                        </div>
				                    </React.Fragment> 	
			                    : null
		                    )
	                      }
	                      </div>

	                      <div className="item">
	                      {
	                      	this.state.promoProducts.map((item,i) => 
		                    
		                    	(i > 3 && i <= 7) ? 
	                				<React.Fragment>
				                        <div className={ ( i >= 6 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
				                          <div className="product-image-wrapper">
				                            <div className="single-products">
				                              <div className="productinfo text-center">
				                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
				                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
				                                <p className="homeNameProduk">{ item.name }</p>
				                              	{
				                                	(this.state.modePenjualan.value === 1) ?
				                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
				                                	: 
				                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
				                                }
				                              </div>
				                            </div>
				                          </div>
				                        </div>
				                    </React.Fragment> 	
			                    : null
		                    )
	                      }
	                      </div> 
	                    </div>
	                    <a className="left recommended-item-control" href="#recommended-item-carousel" data-slide="prev">
	                      <i className="fa fa-angle-left" />
	                    </a>
	                    <a className="right recommended-item-control" href="#recommended-item-carousel" data-slide="next">
	                      <i className="fa fa-angle-right" />
	                    </a>			
	                  </div>
	                </div>


	                {this.state.productsByCategory.map((product,i) =>
	                	<React.Fragment>
    		                <div className="recommended_items">
    		                  <h2 className="title text-center">{ product[0] }</h2>
    		                  <div id={i+"-item-carousel"} className="carousel slide">
    		                    <div className="carousel-inner">
    		                      	<div className="item active">
				                      {
				                      	product[1].map((item,i) => 
					                    
					                    	(i <= 3) ? 
				                				<React.Fragment>
							                        <div className={ ( i >= 2 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
							                          <div className="product-image-wrapper">
							                            <div className="single-products">
							                              <div className="productinfo text-center">
							                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
							                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
							                                <p className="homeNameProduk">{ item.name }</p>
							                              	{
							                                	(this.state.modePenjualan.value === 1) ?
							                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
							                                	: 
							                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
							                                }
							                              </div>
							                            </div>
							                          </div>
							                        </div>
							                    </React.Fragment> 	
						                    : null
					                    )
				                      }
				                      </div>

				                      <div className="item">
				                      {
				                      	product[1].map((item,i) => 
					                    
					                    	(i > 3 && i <= 7) ? 
				                				<React.Fragment>
							                        <div className={ ( i >= 6 ) ? 'col-xs-3 col-sm-3 hidden-xs' : 'col-xs-6 col-sm-3' }>
							                          <div className="product-image-wrapper">
							                            <div className="single-products">
							                              <div className="productinfo text-center">
							                                <Link to={"/product/"+item._id}><img src={"https://api.klikfood.id/uploads/produk/"+item._id+"/"+item.foto_1} style={{maxHeight: '150px'}} alt /></Link>											
							                                <h2 className="homePriceProduk">{ formatter.format(item.harga_jual) +' / '+ item.satuan }</h2>
							                                <p className="homeNameProduk">{ item.name }</p>
							                              	{
							                                	(this.state.modePenjualan.value === 1) ?
							                                	<Link to="/search-mitra" className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} />Lihat</Link>
							                                	: 
							                                	<a href="#" accesskey={item.berat_kemasan} onClick={this.handleAddToCart} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i accesskey={item.berat_kemasan} className="fa fa-shopping-cart" style={{color: 'rgb(22, 224, 46)'}} id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Beli</a>	
							                                }
							                              </div>
							                            </div>
							                          </div>
							                        </div>
							                    </React.Fragment> 	
						                    : null
					                    )
				                      }
				                      </div>
    		                    </div>
    		                    <a className="left recommended-item-control" href={"#"+i+"-item-carousel"} data-slide="prev">
    		                      <i className="fa fa-angle-left" />
    		                    </a>
    		                    <a className="right recommended-item-control" href={"#"+i+"-item-carousel"} data-slide="next">
    		                      <i className="fa fa-angle-right" />
    		                    </a>			
    		                  </div>
    		                </div>
	                	</React.Fragment>
					)}

	              </div>
	            </div>
	          </div>
	        </section>
	        
	        {/*Info-Gratis_Section--#4*/}
	        <div className="container">
	          <div className="row">
	            <div className="col-sm-12"><br /><br />
	              <h2 className="title text-center">Dapatkan info Gratis</h2>				
	              <p />
	            </div>	
	          </div>
	          <center><div className="row">
	              <div className="col-sm-12">
	                <form onSubmit={this.handleSubscribe} className="searchform">
	                  <input type="email" name="emailSubscribe" placeholder="Your email address" onChange={this.handleChange} />
	                  <button type="submit" className="btn btn-success"><i className="fa fa-arrow-circle-o-right" /></button>
	                </form>
	                <br />
	                <center><p>Anda berhak mengikuti sayembara yang kami adakan dengan merekomendasikan link kami.</p></center>
	              </div>
	              <p />
	            </div></center>
	        </div><p />		
	        {/*/End_Info_Gratis_Section--#4*/}

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

	        <footer id="footer">
	        	<FooterTop />
	        	<FooterBottom />
	        </footer>
		</div>
		);
	}
}
export default Home;