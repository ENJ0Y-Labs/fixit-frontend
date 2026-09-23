// fixit-customer\src\home\Category.jsx
import PropTypes from "prop-types";

function Category({
    icon = "fa-solid fa-screwdriver-wrench",
    name = "General Services"
}) {
    return (
        <div className="category">
            <div className="category-icon">
                <i className={icon}></i>
            </div>
            <p className="category-name">{name}</p>
        </div>
    );
}
Category.propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string
}

export default Category;