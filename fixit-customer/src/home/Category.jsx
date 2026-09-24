import PropTypes from 'prop-types';

function Category({ icon = 'fa-solid fa-screwdriver-wrench', name = 'General Services', onSelect }) {
    return (
        <button type="button" className="category" onClick={onSelect}>
            <span className="category-icon" aria-hidden="true"><i aria-hidden="true" className={icon}></i></span>
            <span className="category-name">{name}</span>
        </button>
    );
}

Category.propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    onSelect: PropTypes.func,
};

export default Category;
