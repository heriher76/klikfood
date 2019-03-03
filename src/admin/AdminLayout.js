import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import '../assets/css/node-waves/waves.css';
import '../assets/css/animate-css/animate.css';
import '../assets/css/morrisjs/morris.css';
import '../assets/css/style.css';
import '../assets/css/themes/all-themes.css';
import TopBar from './TopBar';
import LeftBarAdmin from './LeftBarAdmin';
import LeftBarSupplyer from './LeftBarSupplyer';
import LeftBarMitra from './LeftBarMitra';
import LeftBarConsument from './LeftBarConsument';
import Dashboard from './Dashboard';

import CategoryList from './category/CategoryList';
import CategoryCreate from './category/CategoryCreate';
import CategoryUpdate from './category/CategoryUpdate';

import UserList from './user/UserList';
import UserCreate from './user/UserCreate';
import UserUpdate from './user/UserUpdate';

class AdminLayout extends Component {
	componentWillMount() {
		document.body.classList.add('theme-red')
	}

	render() {
		return (
	      <div>
	        {/* Page Loader */}
	        <div className="page-loader-wrapper">
	          <div className="loader">
	            <div className="preloader">
	              <div className="spinner-layer pl-red">
	                <div className="circle-clipper left">
	                  <div className="circle" />
	                </div>
	                <div className="circle-clipper right">
	                  <div className="circle" />
	                </div>
	              </div>
	            </div>
	            <p>Please wait...</p>
	          </div>
	        </div>
	        {/* #END# Page Loader */}
	        {/* Overlay For Sidebars */}
	        <div className="overlay" />
	        {/* #END# Overlay For Sidebars */}
	        
	        {/* Top Bar */}
	        <TopBar />
	        {/* #Top Bar */}
	        <section>
	          {/* Left Sidebar */}
	          {
	          	(sessionStorage.role === 'Administrator') ?
	          		<LeftBarAdmin />
	          		: (sessionStorage.role === 'Supplyer') ?
					<LeftBarSupplyer />
					: (sessionStorage.role === 'Mitra') ?
					<LeftBarMitra />
	          		: 
	          		<LeftBarConsument />
	          }
	          {/* #END# Left Sidebar */}
	          
	        </section>
	        <section className="content">
	          <div className="container-fluid">
	            
	            <main>
	            <Switch>
	            	<Route path="/admin" exact component={Dashboard} />
	            	
	            	<Route path="/admin/categories/:id/update" component={CategoryUpdate} />
	            	<Route path="/admin/categories/create" component={CategoryCreate} />
	            	<Route path="/admin/categories" component={CategoryList} />

	            	<Route path="/admin/users/:id/update" component={UserUpdate} />
	            	<Route path="/admin/users/create" component={UserCreate} />
	            	<Route path="/admin/users" component={UserList} />
	            </Switch>
	            </main>
	          
	          </div>
	        </section>
	        
	      </div>
	    );
	}
}
export default AdminLayout;