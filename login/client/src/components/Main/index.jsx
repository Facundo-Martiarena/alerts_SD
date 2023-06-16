import logo from "../../assets/logo.png";
import styles from "./styles.module.css";
const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
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

		</div>
	);
};

export default Main;
