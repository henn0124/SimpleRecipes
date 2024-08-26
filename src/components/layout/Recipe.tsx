import React from 'react'

const Recipe: React.FC = () => {
  // Example recipe data
  const recipe = {
    name: "Spaghetti Carbonara",
    ingredients: [
      "400g spaghetti",
      "200g pancetta",
      "4 large eggs",
      "100g Parmesan cheese, grated",
      "Freshly ground black pepper",
      "Salt"
    ],
    instructions: [
      "Cook spaghetti in a large pot of salted boiling water until al dente.",
      "While pasta cooks, fry pancetta in a large skillet until crispy.",
      "In a bowl, whisk eggs, grated Parmesan, and black pepper.",
      "Drain pasta, reserving some pasta water.",
      "Quickly toss hot pasta with pancetta, then with egg mixture.",
      "Add pasta water if needed to create a creamy sauce.",
      "Serve immediately with extra Parmesan and black pepper."
    ]
  }

  return (
    <main className="container mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-4">Recipe of the Day</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img 
              src="/api/placeholder/600/400" 
              alt="Spaghetti Carbonara" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h3 className="text-2xl font-semibold mb-4">{recipe.name}</h3>
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Ingredients:</h4>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Recipe
