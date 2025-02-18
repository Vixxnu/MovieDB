import {useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import {BASE_URL} from "../App.jsx"
import {API_OPTIONS} from "../App.jsx";

const MovieDetails = () => {
    const {id} = useParams();
    const [movie, setMovie] = useState('');
    const [credits, setCredits] = useState([]);

    console.log("Movie ID: ", id);

    const fetchMovieDetail = async () => {
        try {
            const response = await fetch(`${BASE_URL}/movie/${id}`,API_OPTIONS);
            if (!response.ok) {
                throw new Error("Could not find movie detail");
            }
            const data = await response.json();
            setMovie(data);

        }catch (error) {
            console.log(error);
        }
    }

    const fetchMovieCredits = async () => {
        try {
            const response = await fetch(`${BASE_URL}/movie/${id}/credits`,API_OPTIONS);
            if (!response.ok) {
                console.log("Error Fetching Movie Credits ");
            }
            const data = await response.json();
            console.log(data.cast);
            setCredits(data.cast);
        }catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMovieDetail();
        fetchMovieCredits();
    },[id])

    return (
        <div className="movie-card-details">
            <h1>{movie.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
            <h3 className="text-white"><strong>Rating:</strong> {movie.vote_average}/10</h3>
            <h3 className="text-white"><strong>Release Date:</strong> {movie.release_date}</h3>
            <h3 className="text-white"><strong>Language:</strong> {movie.original_language}</h3>
            <br></br>
            <h2>OVERVIEW</h2>
            <h4 className="text-white"> {movie.overview}</h4>
            <br></br>
            <h2>CAST</h2>
            <section className="cast-container">
            {credits.map((actor) => (
                <div key={actor.id} className="cast-card">
                    <ul>
                        <img className='text-white' src={actor.profile_path ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}` : "/no-movie.png"} />
                    <p className="text-white"><strong>{actor.name}</strong> as <em>{actor.character}</em></p>
                    </ul>
                </div>
            ))}
            </section>
        </div>
    )
}

export default MovieDetails;