import { AiOutlineUserAdd } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';

const Admin = () => {
    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Poppins, sans-serif', minHeight: '100vh', backgroundColor: '#f4f4f9' }}>
            <Header />
            <main style={{ flex: '1', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '24px', color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>Welcome to Dashboard</div>
                <Link to="/employe">
                    <button style={{ backgroundColor: '#1e7898', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
                        <AiOutlineUserAdd style={{ marginRight: '8px' }} /> Create Employee
                    </button>
                </Link>
            </main>
        </div>
    );
};

export default Admin;
