import React, { Component } from 'react';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';
import 'react-input-range/lib/css/index.css';
import axios from 'axios';
import qs from 'qs';
import { toast } from 'react-toastify';
import Pagination from './Pagination';
import { Link } from 'react-router-dom';
import ContentLoader from "react-content-loader";

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
})

class SearchProduct extends Component {
	constructor() {
	    super();

	    this.state = {
	        pageOfItems: [],
	 		categories: [],
	 		verifiedproducts: [],
	 		carts: [],
	 		products: [],
	 		loader: true
	    };

	    this.onChangePage = this.onChangePage.bind(this);

    	// https://api.klikfood.id/index.php//mitra/produk/5c7ba01c2cb8710944005d39
	}

	onChangePage(pageOfItems) {
	    // update state with new page of items
	    this.setState({ pageOfItems: pageOfItems });
	}

	componentDidMount() {
		var query = this.props.location.search.split('=');
		if( query.length !== 0 ){
			axios.get(`https://api.klikfood.id/index.php/mitra/produk?verify=1&name=`+query[1], { 'headers': { 'Authorization': sessionStorage.api_token } })
		      .then((response) => {
		      	console.log(response);
		      	this.setState({
		      		products: response.data.data,
		      		loader: false
		      	})
		      }).catch((error) => {
		      	toast.error("Gagal Mendapatkan Info Produk :(");
		      })
		}
		axios.get(`https://api.klikfood.id/index.php/kategori`)
		  .then((response) => {
		  	this.setState({
		  		categories: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Tidak Bisa Mendapatkan Kategori :(");
		  })		
		}

	// handleAddToCart = (e) => {
	// 	e.preventDefault();
	// 	this.state.carts.push([e.target.title, e.target.lang, e.target.id, 1]);
	//     localStorage.setItem('cart', JSON.stringify(this.state.carts));
	//     console.log(JSON.stringify(this.state.carts));
	//     console.log(JSON.parse(localStorage.getItem('cart')));
	// 	toast.success("Berhasil Dimasukkan Keranjang !");
	// }
	
	render() {
		const MyLoader = props => (
			<ContentLoader 
				height={160}
				width={400}
				speed={2}
				primaryColor="#f3f3f3"
				secondaryColor="#ecebeb"
				{...props}
			>
				<rect x="104.23" y="124.67" rx="3" ry="3" width="174.8" height="27.65" /> 
				<rect x="93" y="89.67" rx="3" ry="3" width="201" height="25.73" /> 
				<rect x="8.12" y="171.18" rx="0" ry="0" width="422.21" height="124.44" /> 
				<rect x="1.23" y="0.67" rx="0" ry="0" width="410" height="79.8" />
			</ContentLoader>
		)
		
		return (
			<div>
				{/*<section id="advertisement">
		          <div className="container">
		            <img src="/images/shop/advertisement.jpg" alt="advertisement" />
		          </div>
		        </section>*/}
		        <br />
		        <br />
		        <section>
		          <div className="container">
		            <div className="row">
		              
		              <div className="col-sm-12 padding-right">
		                <div className="features_items">{/*features_items*/}
		                  <h2 className="title text-center">Hasil Pencarian</h2>

		                  { this.state.loader ?
		                  <React.Fragment>
		                  {[...Array(9)].map((x, i) =>
						  	<div>
		                      	<div className="col-sm-4">
		                      	  <div className="product-image-wrapper">
		                      	    <div className="single-products">
		                      	      <MyLoader key={i} />
		                      	    </div>
		                      	    <div className="choose">
		                      	      <ul className="nav nav-pills nav-justified">
		                      	        
		                      	      </ul>
		                      	    </div>
		                      	  </div>
		                      	</div>
		                      </div>
						  )}
						  </React.Fragment>
						  :
						  <React.Fragment>
		                  {this.state.pageOfItems.map(item =>
		                      <div>
		                      	<div className="col-sm-4" key={item.id}>
		                      	  <div className="product-image-wrapper">
		                      	    <div className="single-products">
		                      	      <div className="productinfo text-center">
		                      	        <img src={ "https://api.klikfood.id/uploads/produk/" + item._id + "/" + item.foto_1 + "?i=1" } alt="product12" style={{maxHeight: '150px'}} />
		                      	        <h2>{ formatter.format(item.harga_jual) }</h2>
		                      	        <p>{ item.name }</p>
		                      	        <a href="/search-mitra" id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Add to cart</a>
		                      	      </div>
		                      	      <div className="product-overlay">
		                      	        <div className="overlay-content">
		                      	          <h2>{ formatter.format(item.harga_jual) }</h2>
		                      	          <p>{ item.deskripsi }</p>
		                      	          <p>{item.name}</p>
		                      	          <a href="/search-mitra" id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart" id={item._id + "/" + item.foto_1} title={item.name} lang={item.harga_jual} />Add to cart</a>
		                      	        </div>
		                      	      </div>
		                      	    </div>
		                      	    <div className="choose">
		                      	      <ul className="nav nav-pills nav-justified">
		                      	        
		                      	      </ul>
		                      	    </div>
		                      	  </div>
		                      	</div>
		                      </div>
		                  )}
		                  </React.Fragment>
		                  }
		                </div>{/*features_items*/}
		                <center><Pagination items={this.state.products} onChangePage={this.onChangePage} /></center>
		              </div>
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
export default SearchProduct;