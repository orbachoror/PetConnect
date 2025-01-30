import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../General.css";
import { FaUsers, FaChartBar, FaRocket } from "react-icons/fa"; // Importing icons

const Home = () => {
  return (
    <div className="carousel-container">
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="pexels-nancy-guth-269359-850602.jpg"
              className="d-block w-100"
              alt="First slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Pets Improve Mental Health</h5>
              <p>
                Studies show that owning a pet reduces stress, anxiety, and
                depression while increasing feelings of happiness.
              </p>
              <p>
                Petting a dog or cat releases oxytocin, the "love hormone,"
                which promotes bonding and relaxation.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="human & dog.jpg"
              className="d-block w-100"
              alt="Second slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Dogs Can Recognize Human Emotions</h5>
              <p>
                Dogs can read human facial expressions and body language to
                understand emotions like happiness, sadness, and anger.
              </p>
              <p>They even adjust their behavior based on your mood!</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="pexels-peng-louis-587527-1643456.jpg"
              className="d-block w-100"
              alt="Third slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Owning a Pet Can Extend Your Life</h5>
              <p>
                Studies suggest that pet owners live longer, have lower blood
                pressure, and a stronger immune system compared to non-pet
                owners.
              </p>
              <p>
                Dog owners, in particular, tend to be more active and have
                better heart health.
              </p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="stats-container">
        <div className="platform-stats">
          <h2>
            <FaUsers className="icon" /> Hello
          </h2>
          <h6>
            Discover a platform where you can connect, share, and explore.
            Whether you're here to share your thoughts, engage with others, or
            discover new ideas, our app provides an easy and enjoyable
            experience.
          </h6>
        </div>
        <div className="platform-stats">
          <h2>
            <FaChartBar className="icon" /> Explore and Engage
          </h2>
          <h6>
            Browse trending content, leave your mark with likes and comments,
            and interact with posts from people around the globe.
          </h6>
        </div>
        <div className="platform-stats">
          <h2>
            <FaRocket className="icon" /> Your Journey Starts Here
          </h2>
          <h6>
            Sign up today and take part in a growing community built for
            sharing, exploring, and connecting.
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Home;
