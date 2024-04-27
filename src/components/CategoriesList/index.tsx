import { useQuery } from "@tanstack/react-query";
import React from "react";
import { client } from "../../services/GraphQLClient";
import CategoryCard from "../CategoryCard";
import { FullScreenLoader } from "../FullScreenLoader/FullScreenLoader";
import { Link } from "react-router-dom";
import { getCategoriesQueryDocument } from "../../queries/getCategoriesQueryDocument";

const CategoriesList: React.FC<{}> = () => {
  const categoriesQuery = useQuery(["categories"], async () =>
    client.request(getCategoriesQueryDocument)
  );

  if (categoriesQuery.isLoading) {
    return <FullScreenLoader />;
  }

  const categories = categoriesQuery.data?.getCategories;

  if (!categories) {
    return <>You have no categories yet</>;
  }

  return (
    <>
      <h3 className="mb-3 text-lg font-bold">Your categories</h3>
      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <Link key={category.id} to={`/categories/${String(category.id)}`}>
            <CategoryCard key={category.id} category={category} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoriesList;
