import {Outlet} from 'react-router-dom';
import {AdminNavigation, ClientNavigation} from "./Navigation";
import Footer from "./Footer";

export const ClientLayout = () => (
    <div /* layout props & styling */ >
        {/* local layout UI */}
        <ClientNavigation/>
        <div className="main-content"><Outlet/><Footer/></div>
    </div>
);

export const AdminLayout = () => (
    <div /* layout props & styling */ >
        {/* local layout UI */}
        <AdminNavigation/>
        <div className="main-content"><Outlet/></div>
    </div>
);