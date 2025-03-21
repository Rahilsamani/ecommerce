import { useState } from "react";
import axios from "axios";

const ShoppingList = () => {
  const [items, setItems] = useState([{ name: "" }]);
  const [suggestions, setSuggestions] = useState({});
  const [cart, setCart] = useState([]);

  const handleChange = (index, event) => {
    const newItems = [...items];
    newItems[index][event.target.name] = event.target.value;
    setItems(newItems);
  };

  const addItemField = () => {
    setItems([...items, { name: "" }]);
  };

  const checkAvailability = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/product/checkAvailability",
        { items }
      );
      setSuggestions(response.data.suggestions);
      setCart(response.data.availableItems);
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <h2 className="text-2xl font-bold text-center mt-12">
          Quick Grocery List
        </h2>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col gap-4">
            {items.map((item, index) => (
              <input
                key={index}
                type="text"
                name="name"
                placeholder="Enter item name"
                value={item.name}
                onChange={(e) => handleChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={addItemField}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add More
            </button>
            <button
              onClick={checkAvailability}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Check Availability
            </button>
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Cart</h3>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-4 border-b pb-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.name} - {item.brand}
                  </p>
                  <p className="text-gray-600">
                    ₹{item.price}{" "}
                    <span className="line-through text-gray-400">
                      ₹{item.cuttedPrice}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Suggestions Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Suggestions
          </h3>
          {Object.keys(suggestions).length === 0 ? (
            <p className="text-gray-500">No suggestions yet.</p>
          ) : (
            Object.keys(suggestions).map((item, index) => (
              <div key={index} className="mb-6">
                <p className="text-gray-700 font-medium mb-2">
                  {item} is unavailable. Try:
                </p>
                {suggestions[item].map((alt, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 mb-4 border-b pb-4"
                  >
                    <img
                      src={alt.image}
                      alt={alt.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        {alt.name} - {alt.brand}
                      </p>
                      <p className="text-gray-600">
                        ₹{alt.price}{" "}
                        <span className="line-through text-gray-400">
                          ₹{alt.cuttedPrice}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(alt)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
