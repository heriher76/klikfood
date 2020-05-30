import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import '../login.css';
import qs from 'qs';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import FooterTop from './FooterTop';
import FooterBottom from './FooterBottom';

class RegisterMitra extends Component {
	constructor(props) {
		super(props);
		this.state = {
			registName: '',
			registEmail: '',
			registPassword: '',
			registUsername: '',
			registAddress: '',
			registDetailAddress: '',
			registAnotherAddress: '',
			registHp: '',
			registKtp: null,
			registTempat: '',
			registTanggalLahir: '',
			registJK: '',
			registPendidikanTerakhir: '',
			registPekerjaanSekarang: '',
			registNamaReferensi: '',
			registAlasan: '',
			registHaveCompany: '',
			registrating: false,
			redirect: false
		}
		window.scrollTo(0,0);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = (event) => {
		this.setState({ 
			[event.target.name]: event.target.value
		})
	}

	// handleSubmit = (event) => {
	// 	event.preventDefault();
	// 	sessionStorage.clear();
	// 	this.setState({
	// 		submitting: true
	// 	})
	// 	const data = { 
	// 		email: this.state.email,
	// 		password: this.state.password
	// 	}
	// 	axios.post(`https://api.klikfood.id/index.php/login`, qs.stringify( data ))
	//       .then((response) => {
	//       	let responseJSON = response;
	//       	if(responseJSON.data.success) {
	//       		sessionStorage.setItem('api_token', responseJSON.data.data.api_token);
	//       		sessionStorage.setItem('username', responseJSON.data.data.user.name);
	//       		sessionStorage.setItem('email', responseJSON.data.data.user.email);
	//       		sessionStorage.setItem('kota', responseJSON.data.data.user.address);
	//       		sessionStorage.setItem('id', responseJSON.data.data.user._id);
	//       		sessionStorage.setItem('role', responseJSON.data.data.role);
	//       	}  
	//       	toast.success("Selamat Datang !");
	//       	setTimeout(() => {
	//       		this.setState({ 
	//       			submitting: true,
	// 				redirect: true
	//       		});
	//       		// window.location.href='/';
	//       	}, 2000)
	//         console.log(response);
	//       }).catch((error) => {
	//       	toast.error("Gagal Menghubungi Server :(");
	//       	this.setState({
	// 			submitting: false
	// 		})
	//       })
	// }

	handleChangeKTP = (e) => {
		this.setState({registKtp:e.target.files[0]})
	}

	handleRegister = (event) => {
		event.preventDefault();

		this.setState({
			registrating: true
		})

		const bodyFormData = new FormData();
		
		bodyFormData.set('name', this.state.registName);
		bodyFormData.set('username', this.state.registUsername);
		bodyFormData.set('email', this.state.registEmail);
		bodyFormData.set('password', this.state.registPassword);
		bodyFormData.set('birthplace', this.state.registTempat);
		bodyFormData.set('dateofbirth', this.state.registTanggalLahir);
		bodyFormData.set('address', this.state.registAddress);
		bodyFormData.set('detail_address', this.state.registDetailAddress);
		bodyFormData.set('alamat_lain', this.state.registAnotherAddress);
		bodyFormData.set('no_tlp', this.state.registHp);
		bodyFormData.set('jenis_kelamin', this.state.registJK);
		bodyFormData.set('pendidikan_terakhir', this.state.registPendidikanTerakhir);
		bodyFormData.set('perkerjaan_saat_ini', this.state.registNamaReferensi);
		bodyFormData.set('nama_referensi', this.state.registAlasan);
		bodyFormData.set('alasan_menjadi_mitra', this.state.registPekerjaanSekarang);
		bodyFormData.set('sebutkan_jika_sudah_punya_usaha', this.state.registHaveCompany);
		bodyFormData.append('ktp', this.state.registKtp);
		
		let url = 'https://api.klikfood.id/index.php/register/mitra';

		axios.post(url, bodyFormData)
	      .then((response) => {
	      	toast.success("Silahkan Cek Email Verifikasi !");
	      	setTimeout(() => {
	      		this.setState({ 
	      			registrating: true,
					redirect: true
	      		});
	      		// window.location.href='/';
	      	}, 2000)
	        console.log(response);
	      }).catch((error) => {
	      	toast.error("Gagal Menghubungi Server :(");
	      	this.setState({
				registrating: false
			})
	      })
	}

	render() {
		if (this.state.redirect) {
			return (
				<Redirect to={'/'}/>
			)
	    }
		return (
			<div> 
				<section style={{ marginBottom: '80px' }}>{/*form*/}
			        <div className="container">
			          <div className="row">
			            <div className="col-sm-12">
			              <div className="signup-form">{/*sign up form*/}
			                <h2>Daftar Mitra Baru!</h2>
			                
			                <form onSubmit={this.handleRegister} id="distance_form">
			                  <input type="text" name="registName" placeholder="Nama" value={this.state.registName} onChange={this.handleChange} required />
							 {/* <input className="form-control" id="from_places" placeholder="Kota" name="registAddress" onChange={this.handleChange} /> 
							  <input id="origin" name="registAddress" onChange={this.handleChange} required="" type="hidden" />*/}
							  <select name="registAddress" onChange={this.handleChange} className="form-control" required>
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
			                  <input type="text" name="registDetailAddress" placeholder="Alamat Detail ( Jalan / RT / RW / Kode Pos )" value={this.state.registDetailAddress} onChange={this.handleChange} required />
			                  <input type="text" name="registUsername" placeholder="Username" value={this.state.registUsername} onChange={this.handleChange} required />
			                  <input type="email" name="registEmail" placeholder="Alamat Email" value={this.state.registEmail} onChange={this.handleChange} required />
			                  <input type="password" name="registPassword" placeholder="Password" value={this.state.registPassword} onChange={this.handleChange} required />
		                  	  {/*<input type="text" name="registTempat" placeholder="Tempat Lahir" value={this.state.registTempat} onChange={this.handleChange} required />*/}
			                  {/*<p>Tanggal Lahir: </p>*/}
			                  {/*<input type="date" name="registTanggalLahir" placeholder="Tanggal Lahir" value={this.state.registTanggalLahir} onChange={this.handleChange} required />*/}
		                  	  <select name="registJK" onChange={this.handleChange} required>
							    <option>Pilih Jenis Kelamin</option>
							    <option value="Laki-Laki">Laki-Laki</option>
							    <option value="Perempuan">Perempuan</option>
							  </select>
		                  	  <br/>
		                  	  <br/>
		                  	  <input type="text" name="registPendidikanTerakhir" placeholder="Pendidikan Terakhir" value={this.state.registPendidikanTerakhir} onChange={this.handleChange} required />
			                  {/*<input type="text" name="registPekerjaanSekarang" placeholder="Pekerjaan Sekarang" value={this.state.registPekerjaanSekarang} onChange={this.handleChange} required />*/}
			                  <input type="text" name="registNamaReferensi" placeholder="Nama Referensi" value={this.state.registNamaReferensi} onChange={this.handleChange} required />
			                  {/*<input type="text" name="registAlasan" placeholder="Alasan Ingin Jadi Mitra" value={this.state.registAlasan} onChange={this.handleChange} required />*/}
			                  {/*<input type="text" name="registHaveCompany" placeholder="Anda Punya Perusahaan ?" value={this.state.registHaveCompany} onChange={this.handleChange} required />*/}
			                  
			                  <input type="text" name="registHp" placeholder="No HP" value={this.state.registHp} onChange={this.handleChange} required />

			                </form>
			              </div>{/*/sign up form*/}
			              	  <p>Upload Foto KTP</p>
		                  	  <input form="distance_form" type="file" name="registKtp" onChange={this.handleChangeKTP} required />
			                  <br />
			            	<p>Dengan Mengisi Formulir Ini Saya Menyatakan :</p>
			                  
		                      <input form="distance_form" type="checkbox" required style={{position: 'relative'}} />Bahwa data tersebut adalah benar adanya.
		                      <br />
			                  <input form="distance_form" type="checkbox" required style={{position: 'relative'}} />Bahwa saya sepakat dan bersedia mengikuti aturan perusahaan tentang menjadi Mitra.
							  <br />
								{this.state.registrating ?
								<div>
									<b>Mendaftar...</b>
								</div>
								:
									<button form="distance_form" type="submit" className="btn btn-success">Daftar</button>
								}
			            </div>
			          </div>
			        </div>
			      </section>{/*/form*/}
			      <footer id="footer">
			      	<FooterTop />
			      	<FooterBottom />
			      </footer>
			</div>
		);
	}
}
export default RegisterMitra;