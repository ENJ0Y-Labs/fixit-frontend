import PropTypes from 'prop-types';

function Category({ icon = '🔧', name = 'General Services', onSelect }) {
    return (
        <button type="button" className="category" onClick={onSelect} aria-label={name}>
            <span className="category-icon" aria-hidden="true">
                <span className="category-symbol">{icon}</span>
            </span>
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
