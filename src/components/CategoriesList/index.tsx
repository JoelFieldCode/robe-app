import { useQuery } from "@tanstack/react-query";
import React from "react";
import { client } from "../../services/GraphQLClient";
import CategoryCard from "../CategoryCard";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { getCategoriesQueryDocument } from "../../queries/getCategoriesQueryDocument";
import { Button } from "../../@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const CategoriesList: React.FC<{}> = () => {
  const categoriesQuery = useQuery(["categories"], async () =>
    client.request(getCategoriesQueryDocument)
  );

  if (categoriesQuery.isLoading) {
    return <FullScreenLoader />;
  }

  const categories = categoriesQuery.data?.getCategories;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Your categories</h3>
        <Button asChild variant="outline" size="icon" className="rounded-3xl">
          <Link to="/create-category">
            <Plus />
          </Link>
        </Button>
      </div>
      {!categories?.length && (
        <div className="flex flex-col gap-2">
          <div>Not seeing anything here? Create an item to get started!</div>
          <div>
            <Button asChild>
              <Link to="/items/create">Create Item</Link>
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
