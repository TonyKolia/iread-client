import React from "react";
import { useParams } from "react-router-dom";
import Loading from "../Loading";
import "../../css/style.css";
import Helpers from "../../Helpers/Helpers";
import API from "../../Helpers/API";
import { BasketContext, BASKET_ACTIONS, UserContext } from "../../App";
import Ratings from "../Ratings/Ratings";
import BookPageRecommendations from "./BookPageRecommendations";


export default function BookPage() {

    const { id } = useParams();
    const [book, setBook] = React.useState({});
    const basket = React.useContext(BasketContext);
    const user = React.useContext(UserContext);
    const [favorite, setFavorite] = React.useState(false);
    const [reloadBook, setReloadBook] = React.useState(false); //used as a toggle to refresh book data

    const url = `${API.API_URL_GET_BOOK}${id}`;

    React.useEffect(() => {

        Helpers.performGet(url)
            .then(response => {
                if (response.success)
                    setBook(response.data)
            });

    }, [reloadBook]);

    console.log(reloadBook);

    React.useEffect(() => {

        if (user.user.userId !== "" && book.id !== undefined) {
            let url = API.API_URL_GET_FAVORITE_EXISTS.replace(":userId", user.user.userId).replace(":bookId", book.id);
            Helpers.performGet(url, user.user.token).then(response => {
                if (response.data) {
                    return setFavorite(true);
                }
                else {
                    return setFavorite(false);
                }
            });
        }
    }, [user, book, favorite])

    const addFavorite = (bookId) => {

        if (user.user.userId == "")
            return alert("login man");

        Helpers.performPost(API.API_URL_ADD_NEW_FAVORITE, { userId: user.user.userId, bookId: bookId }, user.user.token)
            .then(response => {
                if (response.success) {
                    Helpers.successMessage("Προστέθηκε στους σελιδοδείκτες!");
                    return setFavorite(true);
                }
                else
                    return alert("lol");
            });
    }

    const scrollToComments = () => {
        let element = document.getElementById("ratings");
        element.scrollIntoView();
    };

    return (

        Object.keys(book).length === 0 ? <Loading /> :

            <div>
                <div className="card book-container mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">

                            <i onClick={favorite ? null : () => addFavorite(book.id)} className={`fa-solid fa-bookmark ${favorite ? "favorite" : ""}`}></i>
                            <img src={`${API.API_URL_GET_BOOK_IMAGE}${book.imagePath}`} className="img-fluid book-img" alt="..." />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h4>{book.title}</h4>
                                <ul className="list-group">
                                    <li key="authors" className="list-group-item">Συγγραφείς: {book.authors?.map((author, i, arr) => <span key={author.id}><a href={"/author/" + author.id}>{author.name}</a>{Helpers.addCommaIfNeeded(i, arr)}</span>)}</li>
                                    <li key="categories" className="list-group-item">Κατηγορία: {book.categories?.map((category, i, arr) => <span key={category.id}><a href="#">{category.description}</a>{Helpers.addCommaIfNeeded(i, arr)}</span>)}</li>
                                    <li key="isbn" className="list-group-item">ISBN: {book.isbn}</li>
                                    <li key="publishers" className="list-group-item">Εκδόσεις: {book.publishers?.map((publisher, i, arr) => <span key={publisher.id}><a href="#">{publisher.name}</a>{Helpers.addCommaIfNeeded(i, arr)}</span>)} </li>
                                    <li key="publishDate" className="list-group-item">Έτος έκδοσης: {Helpers.getYearFromDate(book.publishDate)}</li>
                                    <li key="pages" className="list-group-item">Σελίδες: {book.pageCount}</li>
                                    <li key="description" className="list-group-item" style={{ textAlign: "justify", height: "240px", overflow: "scroll" }}>{book.description}</li>
                                </ul>
                                <div className="book-details-actions">
                                    <div className="book-rating" onClick={scrollToComments} title="Δείτε τις κριτικές">
                                        <i className="fa-solid fa-star"></i>
                                        <span style={{ color: "var(--main-detail-color)", fontWeight: "bold" }}>{book.rating}/5  ({book.totalRatings})</span>
                                    </div>
                                    <button type="button" data-bs-toggle="modal" data-bs-target="#rating-modal" className="btn btn-primary btn-custom card-btn"><i className="fa-solid fa-star"></i>Αξιολόγηση</button>
                                    {book.stock == 0 && <span className="badge rounded-pill not-available-badge"><i class="fa-solid fa-xmark"></i>Μη διαθέσιμο</span>}
                                    {book.stock > 0 && <button type="button" disabled={book.stock == 0} onClick={() => basket.manageBasket({ type: BASKET_ACTIONS.ADD_ITEM, payload: { itemId: book.id } })} className="btn btn-primary btn-custom card-btn"><i className="fa-solid fa-basket-shopping"></i>Στο καλάθι</button>}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <BookPageRecommendations bookId={book.id} />
                <Ratings setReloadBook={setReloadBook} bookId={book.id} bookTitle={book.title} />
            </div >
    );


}