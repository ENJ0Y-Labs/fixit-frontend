import PropTypes from 'prop-types';

function Category({ icon = 'fa-solid fa-screwdriver-wrench', name = 'General Services' }) {
    return (
        <button type="button" className="category">
            <span className="category-icon" aria-hidden="true">
                <i className={icon}></i>
            </span>
            <span className="category-name">{name}</span>
        </button>
    );
}

Category.propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
};

export default Category;
