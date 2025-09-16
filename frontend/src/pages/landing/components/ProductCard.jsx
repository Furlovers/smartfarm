import { FaCheck } from "react-icons/fa";
import Button from "../../../components/ui/Button";
import { Link } from "react-router-dom";

export default function ProductCard({ tier }) {
  return (
    <div className="relative rounded-xl shadow-md overflow-hidden bg-white h-full flex flex-col">
      <div className="p-6 text-center flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-3xl font-bold mb-2">{tier.name}</h3>
          <p className="text-gray-600 mb-4">{tier.description}</p>
          <div className="text-3xl font-bold mb-6">{tier.price}</div>
          <ul className="text-left space-y-3 mb-8">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 text-green-600">
                  <FaCheck
                    className={`text-${tier.color}-500 mt-1 mr-2 flex-shrink-0`}
                  />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <Link to="/login">
          <Button>Assinar</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
