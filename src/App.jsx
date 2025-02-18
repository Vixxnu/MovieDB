import React, {useEffect, useState} from 'react'
import Search from "./component/Search.jsx";
import Moviecard from "./component/Moviecard.jsx";
export const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const API_OPTIONS={
    method:'GET',
    headers:{
        Accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}
import {useDebounce} from "react-use";
import {gettrendingMovies, updateSearchTerm} from "./appwrite.jsx";



const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovielist] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [trendingMovies, settrendingMovies] = useState([]);
    const [DebouncedSearch, setDebouncedSearch] = useState('');

    useDebounce(()=> setDebouncedSearch(searchTerm),2000, [searchTerm])

    const fetchMovies= async (query = ' ') => {
        setisLoading(true);
        setErrorMessage('')
        try {
            const endpoint = query ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                :`${BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {throw new Error('Something went wrong');}
            const data = await response.json();
            if (data.response===false) {
                setErrorMessage(data.Error || 'failed to fetch movies!');
                setMovielist([]);
                return;
            }
            setMovielist(data.results || [])
            if(query && data.results.length>0){
                await updateSearchTerm(query, data.results[0]);
            }
        }catch (error) {
            console.log(error)
            setErrorMessage('Error fetching movies.Try again');
        }finally {
            setisLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await gettrendingMovies();
            settrendingMovies(movies);
        }catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMovies(DebouncedSearch);
    }, [DebouncedSearch]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Movies</span> Youll Enjoy</h1>
                    <Search searchterm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie,index)=>(
                                <li key={movie.$id}>
                                    <p>{index+1}</p>
                                    <img src={movie.poster_url} alt={movie.title} />
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                <section className='all-movies'>
                    <h2>All Movies</h2>
                    {isLoading ? (<p className="text-white">Loading...</p>
                    ):errorMessage?(<p className="text-red-500">Error fetching movies</p>
                    ):(

                                <ul>
                                    {movieList.map(movie => (
                                        <Moviecard key={movie.id} movie={movie} />
                                    ))}
                                </ul>

                    )}
                </section>
            </div>
        </main>

    )
}

export default App
