import { Ruler, ShoppingCart, Wrench, FlaskConical } from 'lucide-react';

interface CompanyServicesProps {
  className?: string;
}

const CompanyServices = ({ className = "" }: CompanyServicesProps) => {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-white mb-4 text-base font-semibold leading-tight px-4 text-center break-words-safe text-pretty">
        Dal 1963 progettiamo, vendiamo e<br />
        assistiamo attrezzature professionali per cucine
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto mb-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Ruler className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-white font-medium text-center">Progettazione</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-white font-medium text-center">Vendita</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-white font-medium text-center">Assistenza</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-white font-medium text-center">SchettinoLab</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyServices;

