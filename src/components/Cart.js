import React, { Component } from 'react';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';
import { Redirect, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
})

class Cart extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
	 		carts: [],
	 		hargaNya: [],
			beratNya: [],
			jumlahHarga: '',
			jumlahBerat: '',
			beratPerProduk: [],
			jumlahOngkir: '',
	 		modePenjualan: '',
	 		payment_type: '',
	 		loadOngkir: false,
	 		submitting: false,
	 		errorOngkir: 0
	    };
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

		if(sessionStorage.length !== 0) {
			const cekOngkir = new FormData();
			console.log(sessionStorage);
			cekOngkir.set('alamat_tujuan', sessionStorage.kota);

			axios.post(`https://api.klikfood.id/jarak`, cekOngkir)
			  .then((response) => {
			  	if(response.data.data.harga !== 0){
				  	this.setState({
				  		jumlahOngkir: response.data.data.harga,
				  		errorOngkir: 2
				  	})
			  	}else{
			  		this.setState({
				  		errorOngkir: 1
				  	})
			  	}
			  }).catch((error) => {
			  	toast.error("Gagal Mendapatkan Jumlah Ongkir :(");
			  })
		}

		var carts = JSON.parse(localStorage.getItem('cart'));
		let jumlahBeratNya = null;
		let jumlahHargaNya = null;
		let beratProduk = [];
		if(carts){
			carts.map((item, i) => {
				this.state.carts.push(item);
				jumlahBeratNya += Number(item[4]);
				jumlahHargaNya += Number(item[1]);
				beratProduk[i] = Number(item[4]);
			})
			this.setState({
				jumlahBerat: jumlahBeratNya,
				beratPerProduk: beratProduk,
				jumlahHarga: jumlahHargaNya
			})
		}
	}

	componentDidMount() {
		// console.log(this.state.jumlahHarga)
		// const cekOngkir = new FormData();
		// console.log(sessionStorage);
		// cekOngkir.set('tujuan', sessionStorage.kota);
		// cekOngkir.set('berat', this.state.jumlahBerat);

		// axios.defaults.headers = {  
		// 	'Authorization': sessionStorage.api_token 
		// }
		
		// axios.post(`https://api.klikfood.id/index.php/ongkir/harga`, cekOngkir)
	 //      .then(res => {
	 //      	console.log(res);
	 //      	this.setState({
	 //      		listOngkir: res.data.data
	 //      	})
	 //      }).catch(err => {
	 //  //     	if(localStorage.getItem('redirectOnce')){
		// 	// 	window.location.href='/admin/distribution/order/courier';
		// 	// 	localStorage.removeItem('redirectOnce');
		// 	// }
	 //      });

	      // this.setState({
	      // 	jumlahTotal: this.state.jumlahHarga + this.state.jumlahOngkir
	      // })
	}

	handleDeleteCart = (i, price, quantity) => {
		// this.setState( state => {

		const carts = this.state.carts.filter((item, j) => i !== j);
		
		const sebelumTotalHarga = Number(localStorage.getItem('keranjangTotalHarga')) - Number(price) * Number(quantity);
		
	    localStorage.setItem('keranjangTotalHarga', sebelumTotalHarga);

		// 	return {
		// 		carts,
		// 	}
		// });
		localStorage.setItem('cart', JSON.stringify(carts));
		this.setState({
			carts: JSON.parse(localStorage.getItem('cart')),
			jumlahHarga: sebelumTotalHarga
		})
		// window.location.href='/cart';
	}

	handleChange = (event) => {
		this.setState({ 
			jumlahOngkir: event.target.id
		})
	}

	handleChangePaymentType = (event) => {
		this.setState({ 
			[event.target.name]: event.target.value
		})
	}

	handleSubmitOrder = (e) => {
		if (sessionStorage.length === 0) {
			{toast.warning("Login Terlebih Dahulu !")}
			window.location.href='/login';
	    }else{
			e.preventDefault();
			this.setState({
				submitting: true
			})
			const willParsedCart = JSON.parse(localStorage.getItem('cart'));
			let finalCart = [...Array(willParsedCart.length)].map( x => Array(2).fill(0) );

			willParsedCart.map((item,i) => {
				finalCart[i][0] = (item[2].split('/')[0]);
				finalCart[i][1] = (item[3]);
			})
			console.log(finalCart);
			var obj = {
			    'produk' : finalCart,
			    'type' : this.state.payment_type
			};
			console.log(obj);
			
			axios.defaults.headers = {  
				'Authorization': sessionStorage.api_token 
			}
			if(this.state.modePenjualan.value === 1) {
				axios.post(`https://api.klikfood.id/transaksi/store`, obj)
			      .then(res => {
			      	this.setState({
			      		submitting: true
			      	})
			      	console.log(res.data.data);
			      	toast.success(res.data.messages);
			      	localStorage.clear();
			      	
			      	if(this.state.payment_type === 'CC') {
		      			setTimeout(() => {
			      			window.location.href='/cart/cc-detail?id='+res.data.data._id;
			      		}, 2000)	
			      	}else if(this.state.payment_type === 'VA'){
			      		setTimeout(() => {
			      			window.location.href='/cart/thanks?id='+res.data.data._id;
			      		}, 3000)
			      	}else{
			      		setTimeout(() => {
			      			window.location.href='/admin/transactions/'+res.data.data._id;
			      		}, 3000)
			      	}

			      }).catch(err => {
			      	this.setState({
			      		submitting: false
			      	})
			      	console.log(err);
			      	toast.error("Tidak Bisa Diorder :( ");
			      });
			}else{
				axios.post(`https://api.klikfood.id/transaksipusat/store`, obj)
			      .then(res => {
			      	this.setState({
			      		submitting: true
			      	})
			      	console.log(res.data);
			      	localStorage.clear();
			      	toast.success(res.data.messages);

			      	if(this.state.payment_type === 'CC') {
		      			setTimeout(() => {
			      			window.location.href='/cart/cc-detail?id='+res.data.data._id;
			      		}, 2000)
			      	}else if(this.state.payment_type === 'VA'){
			      		setTimeout(() => {
			      			window.location.href='/cart/thanks?id='+res.data.data._id;
			      		}, 3000)
			      	}else{
			      		setTimeout(() => {
			      			window.location.href='/admin/transactions/'+res.data.data._id;
			      		}, 3000)
			      	}

			      }).catch(err => {
			      	this.setState({
			      		submitting: false
			      	})
			      	console.log(err);
			      	toast.error("Tidak Bisa Diorder :( ");
			      });
			}
		}
	}

	render() {
		if (this.state.carts.length === 0) {
			{toast.warning("Silahkan Pilih Produk Dahulu !")}
			return (
				<Redirect to={'/'}/>
			)
	    }

		return (
			<div>
			<ToastContainer />
				<section id="cart_items">
		          <div className="container">
		            <div className="breadcrumbs">
		              <ol className="breadcrumb">
		                <li><a href="/">Home</a></li>
		                <li className="active">Shopping Cart</li>
		              </ol>
		            </div>
		            <div className="table-responsive cart_info">
		              <table className="table table-condensed">
		                <thead>
		                  <tr className="cart_menu" onClick={e => console.log(this.state.carts)}>
		                    <td className="image">Item</td>
		                    <td className="description" />
		                    <td className="price">Price</td>
		                    <td className="quantity">Quantity</td>
		                    <td className="total">Total</td>
		                    <td />
		                  </tr>
		                </thead>
		                <tbody>
		                { this.state.carts.map( (cart, index) => 
		                  <tr>
		                    <td className="cart_product">
		                      <a href><img src={ "https://api.klikfood.id/uploads/produk/"+ cart[2] } alt="cart" width="150" /></a>
		                    </td>
		                    <td className="cart_description">
		                      <h4><a href>{ cart[0] }</a></h4>
		                      {/*<p>Web ID: 1089772</p>*/}
		                    </td>
		                    <td className="cart_price">
		                      <p>{ formatter.format(cart[1]) }</p>
		                    </td>
		                    <td className="cart_quantity">
		                      <div className="cart_quantity_button">
		                        <a className="cart_quantity_down" onClick={e => {
		                        	const newJumlah = this.state.carts.slice();
		                        	if(newJumlah[index][3] > 1){
			                        	let jumlahBeratSekarang = this.state.jumlahBerat;

			                        	const sebelumTotalHarga = Number(localStorage.getItem('keranjangTotalHarga')) - Number(cart[1]);
									
	    								localStorage.setItem('keranjangTotalHarga', sebelumTotalHarga);
		                        	
			                        	newJumlah[index][3] -= 1;
			                        	newJumlah[index][4] = Number(newJumlah[index][4]) - this.state.beratPerProduk[index];
			                        	jumlahBeratSekarang = Number(jumlahBeratSekarang) - this.state.beratPerProduk[index];
			                        	this.setState({
			                        		carts: newJumlah,
			                        		jumlahBerat: jumlahBeratSekarang,
			                        		jumlahHarga: sebelumTotalHarga
			                        	});

			    						localStorage.setItem('cart', JSON.stringify(this.state.carts));

										{/*const cekOngkir = new FormData();
										cekOngkir.set('tujuan', sessionStorage.kota);
										cekOngkir.set('berat', this.state.jumlahBerat);

										axios.defaults.headers = {  
											'Authorization': sessionStorage.api_token 
										}
										
										axios.post(`https://api.klikfood.id/index.php/ongkir/harga`, cekOngkir)
									      .then(res => {
									      	this.setState({
									      		listOngkir: res.data.data,
									      		loadOngkir: false
									      	})
									      }).catch(err => {
									  			loadOngkir: false
									      });*/} 
		                        	}
		                        } }  href> - </a>
		                        <input className="cart_quantity_input" type="text" value={cart[3]} name="quantity" autoComplete="off" size={2} />
		                        <a className="cart_quantity_up" lang={cart[4]} onClick={e => {
		                        	const newJumlah = this.state.carts.slice();
		                        	let jumlahBeratSekarang = this.state.jumlahBerat;
		                        	
		                        	const sebelumTotalHarga = Number(localStorage.getItem('keranjangTotalHarga')) + Number(cart[1]);
									
	    							localStorage.setItem('keranjangTotalHarga', sebelumTotalHarga);
		                        	
		                        	newJumlah[index][3] += 1;
		                        	newJumlah[index][4] = Number(newJumlah[index][4]) + this.state.beratPerProduk[index];
		                        	jumlahBeratSekarang = Number(jumlahBeratSekarang) + this.state.beratPerProduk[index];
		                        	this.setState({
		                        		carts: newJumlah,
		                        		jumlahBerat: jumlahBeratSekarang,
		                        		jumlahHarga: sebelumTotalHarga
		                        	});

		    						localStorage.setItem('cart', JSON.stringify(this.state.carts));

									{/*const cekOngkir = new FormData();
									cekOngkir.set('tujuan', sessionStorage.kota);
									cekOngkir.set('berat', this.state.jumlahBerat);

									axios.defaults.headers = {  
										'Authorization': sessionStorage.api_token 
									}
									
									axios.post(`https://api.klikfood.id/index.php/ongkir/harga`, cekOngkir)
								      .then(res => {
								      	console.log(res.data.data);
								      	this.setState({
								      		listOngkir: res.data.data,
								      		loadOngkir: false
								      	})
								      }).catch(err => {
								  			loadOngkir: false
								      });*/}
		                        } } href> + </a>
		                      </div>
		                    </td>
		                    <td className="cart_total">
		                      <p className="cart_total_price">{ formatter.format(cart[1] * cart[3]) }</p>
		                    </td>
		                    <td className="cart_delete">
		                      <a className="cart_quantity_delete" style={{ backgroundColor: 'black' }} id={cart[0]} onClick={ e => this.handleDeleteCart(index, cart[1], cart[3]) } href><i className="fa fa-trash-o" id={index} /></a>
		                    </td>
		                  </tr>
		                ) }
		                </tbody>
		              </table>
		            </div>
		          </div>
		        </section> {/*/#cart_items*/}
		        <section id="do_action">
		          <div className="container">
		            <div className="heading">
		              <h3>Total Pembayaran</h3>
		            </div>
		            <div className="row">
		              {/*<div className="col-sm-6">
		                <div className="chose_area">
		                  <ul className="user_option">
		                  	{
		                  	 (sessionStorage.length === 0) ?
								<p>Silahkan <Link to="/login">Login</Link> Terlebih Dahulu</p>
							 : 
							 <React.Fragment>
							 	{ formatter.format(this.state.jumlahOngkir) }
							 </React.Fragment>
						    }
		                  </ul>
		                  <ul className="user_info">
		                    <li className="single_field">
		                      <label>Country:</label>	
		                      <select>
		                        <option>United States</option>
		                        <option>Bangladesh</option>
		                        <option>UK</option>
		                        <option>India</option>
		                        <option>Pakistan</option>
		                        <option>Ucrane</option>
		                        <option>Canada</option>
		                        <option>Dubai</option>
		                      </select>
		                    </li>
		                    <li className="single_field">
		                      <label>Region / State:</label>
		                      <select>
		                        <option>Select</option>
		                        <option>Dhaka</option>
		                        <option>London</option>
		                        <option>Dillih</option>
		                        <option>Lahore</option>
		                        <option>Alaska</option>
		                        <option>Canada</option>
		                        <option>Dubai</option>
		                      </select>
		                    </li>
		                    <li className="single_field zip-field">
		                      <label>Zip Code:</label>
		                      <input type="text" />
		                    </li>
		                  </ul>
		                  {/*<a className="btn btn-default update" href>Get Quotes</a>
		                  <a className="btn btn-default check_out" href>Continue</a>*/}
		                {/*</div>
		              </div>*/}
		              <div className="col-sm-12">
		                <div className="total_area">
      					  <ul>
		                    <li><h4>Keranjang Sub Total <span>{ formatter.format(this.state.jumlahHarga) }</span></h4></li>
		                    <li><h4>Biaya Pengiriman <span>{ formatter.format(this.state.jumlahOngkir) }</span></h4></li>
		                    <li><h4>Total <span>{ formatter.format(Number(this.state.jumlahHarga) + Number(this.state.jumlahOngkir)) }</span></h4></li>
		                  </ul>
		                </div>
		              </div>

						<div className="heading container">
							<h3>Metode Pembayaran</h3>
						</div>
		              <div className="col-sm-12">
		                <div className="total_area">
		                  {
		                  	(sessionStorage.length === 0) ?
		                  		<React.Fragment>
		                  			<center><h3>Untuk Melakukan Pembayaran Silahkan <a href="/login">Login</a> Terlebih Dahulu</h3></center>
		                  		</React.Fragment>
		                  	:
		                  		<React.Fragment>
		                  		{
		                  			(this.state.errorOngkir === 2) ? 
		                  				<React.Fragment>
		                  				<div className="container">
		                  					<input type="radio" name="payment_type" onClick={this.handleChangePaymentType} style={{position: 'relative', float: 'left'}} value="VA"/><h4 style={{float: 'left'}}> Virtual Account</h4>
			        		            	<br/><br/>
		                  					<input type="radio" name="payment_type" onClick={this.handleChangePaymentType} style={{position: 'relative', float: 'left'}} value="CC"/><h4 style={{float: 'left'}}> Credit Card</h4>
			        		            	<br/><br/>
		                  					<input type="radio" name="payment_type" onClick={this.handleChangePaymentType} style={{position: 'relative', float: 'left'}} value="TF"/><h4 style={{float: 'left'}}> Transfer Bank</h4>
			        		            </div>
			        		            	<br/>
							            	<br/>
							                  {this.state.submitting ?
												<div>
													<b>Sedang Memesan...</b>
												</div>
												:
					                  		  		<button className="btn btn-default update" onClick={this.handleSubmitOrder} href>Pesan Sekarang !</button>
												}
		                  				</React.Fragment>
		                  			: (this.state.errorOngkir === 1) ?
		                  				<React.Fragment>
		                  					<center>
		                  						<h3>Maaf, Kota Anda Diluar Jangkauan Pengiriman Kami.</h3>
		                  						<p>Silahkan Ganti Kota Pengiriman di <a href="/profile">Halaman Profil Anda</a></p>
		                  					</center>
		                  				</React.Fragment>
		                  			:
		                  				<React.Fragment>
		                  					<center>
		                  						<h3>Sedang Kalkulasi Ongkir...</h3>
		                  					</center>
		                  				</React.Fragment>
		                  		}
		                  		</React.Fragment>
		                  }
		                </div>
		              </div>
		            </div>
		          </div>
		        </section>{/*/#do_action*/}
		        <footer id="footer">
			      	<FooterTop />
			      	<FooterBottom />
		      	</footer>
			</div>
		);
	}
}
export default Cart;