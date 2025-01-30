import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../General.css";

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
              <h5>Hello</h5>
              <p>
                Discover a platform where you can connect, share, and explore.
                Whether you're here to share your thoughts, engage with others,
                or discover new ideas, our app provides an easy and enjoyable
                experience.
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
              <h5>Explore and Engage</h5>
              <p>
                Browse trending content, leave your mark with likes and
                comments, and interact with posts from people around the globe.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="pexels-peng-louis-587527-1643456.jpg"
              className="d-block w-100"
              alt="Third slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Your Journey Starts Here</h5>
              <p>
                Sign up today and take part in a growing community built for
                sharing, exploring, and connecting.
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
    </div>
  );
};

export default Home;
