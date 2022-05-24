import { useEffect } from "react";
import Axios from "axios";
import store from "../../redux/store";
// import { useSelector } from "react-redux";
import * as ACTIONS from "../../redux/actionTypes";
// import Cookies from "universal-cookie/es6";
// const cookies = new Cookies();

const Home = () => {
     // const years = useSelector((state) => state.years);

     useEffect(() => {
          (async function () {
               const { accessToken } = store.getState().user;
               if (accessToken) {
                    const instance = Axios.create({
                         method: "GET",
                         baseURL: "http://localhost:3001/owner/years",
                         headers: { authorization: `Bearer ${accessToken}` },
                    });

                    try {
                         const response = await instance();
                         if (response.status === 200) {
                              // console.log(response.data);
                              store.dispatch({ type: ACTIONS.YEAR.UPDATED_ALL, payload: response.data.years });
                         }
                    } catch (error) {
                         console.log(error.message);
                    }
               }
          })();
     }, []);

     return <div>Home</div>;
};

export default Home;
