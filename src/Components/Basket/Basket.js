import React, { useContext } from "react";
import "../../css/style.css";
import API from "../../Helpers/API";
import Helpers from "../../Helpers/Helpers";
import BasketItem from "./BasketItem";
import { useNavigate } from "react-router-dom";
import { BasketContext, BASKET_ACTIONS, UserContext } from "../../App";
import Loading from "../Loading";

export default function Basket(props) {

    const [basketBooks, setbasketBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    let navigate = useNavigate();
    const user = useContext(UserContext);
    const basket = useContext(BasketContext);

    function constructUrl(basketItems) {
        var bookIds = "";
        basketItems.forEach(itemId => {
            bookIds += itemId + "-";
        });
        bookIds = bookIds.substring(0, bookIds.length - 1);

        return API.API_URL_GET_MULTIPLE_BOOKS + bookIds;
    }

    const clearBasket = () => {
        basket.manageBasket({ type: BASKET_ACTIONS.CLEAR });
        setbasketBooks([]);
    }

    const removeItemFromBasket = (itemId) => {
        basket.manageBasket({ type: BASKET_ACTIONS.DELETE_ITEM, payload:{ itemId: itemId }});
        setbasketBooks(currentBooks => currentBooks.filter(x => x.id !== itemId));
    }

    React.useEffect(() => {
        setLoading(true);
        Helpers.performGet(constructUrl(basket.basket.current))
            .then(response => {
                setLoading(false);
                if (response.success)
                    setbasketBooks(response.data);
                else
                    setbasketBooks([]);
            });
    }, [basket.basket]);

    function submitOrder() {

        if (user.user.userId === "") {
            let loginLink = document.getElementById("loginLink");
            loginLink.click();
            return;
        }

        var order = {
            userId: user.user.userId,
            books: basket.basket.current
        }
        setLoading(true);
        Helpers.performPost(API.API_URL_ORDER, order, user.user.token)
            .then(response => {
                setLoading(false);
                if (response.success) {
                    basket.manageBasket({ type: BASKET_ACTIONS.CLEAR });
                    return navigate(`/order-completed/${response.data.orderId}`, { state: true });
                }
                else {
                    return navigate("/error");
                }
            });
    }

    return (
        <div className="cart-container">
            <h4><i className="fa-solid fa-basket-shopping"></i>Το καλάθι μου</h4>
            {
                loading ? <Loading /> :
                    <>
                        {
                            basketBooks === undefined || basketBooks.length == 0 ? <h5>Δεν υπάρχουν βιβλία στο καλάθι.</h5> :
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Τίτλος</th>
                                            <th>Ημερομηνία επιστροφής</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {basketBooks?.map(book => <BasketItem key={book.id} id={book.id} title={book.title} imagePath={book.imagePath} removeItemFromBasket={removeItemFromBasket} />)}
                                    </tbody>
                                </table>
                        }

                        <div>
                            <div className={`cart-btn-container ${basketBooks === undefined || basketBooks.length === 0 ? "empty" : ""} `}>
                                <button onClick={() => navigate("/")} type="button" className="btn btn-primary btn-custom"><i className="fa-solid fa-arrow-left"></i>Επιστροφή</button>
                                {(basketBooks !== undefined && basketBooks.length > 0) && <button type="button" onClick={clearBasket} className="btn btn-primary btn-custom"><i className="fa-solid fa-arrow-rotate-right"></i>Καθαρισμός</button>}
                                {(basketBooks !== undefined && basketBooks.length > 0) && <button type="button" onClick={submitOrder} className="btn btn-primary btn-custom"><i className="fa-solid fa-check"></i>Κράτηση</button>}
                            </div>
                        </div>
                    </>
            }

        </div>
    );
}