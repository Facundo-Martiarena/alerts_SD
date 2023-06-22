import logo from "../../assets/logo.png";
import styles from "./styles.module.css";
const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	const handleEstadistico = () => {
		window.location.href = 'http://localhost:3001/'
	};

	const handleReparaciones = () => {
		window.location.href = 'http://localhost:3001/'
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<img src={logo} alt="Logo" className="logo" height={50} />
				<h1>ALERTAS URUGUYA</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
			<div className={`${styles.main_container} ${styles.center_container}`}>
				<button className={styles.green_btn} onClick={handleEstadistico}>
					Estadistico
				</button>
				<button className={styles.green_btn} onClick={handleReparaciones}>
					Reparaciones
				</button>
			</div>


		</div>
	);
};

export default Main;
