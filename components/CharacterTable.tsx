
import React from 'react';
import { JapaneseCharacter, OrganizedTableData } from '../types'; // Corrected import

interface CharacterTableCellProps {
  item: JapaneseCharacter | { char: string; romaji: string; note?: string } | null;
  onCharClick?: (charItem: JapaneseCharacter | { char: string; romaji: string; note?: string }) => void;
}

const CharacterTableCell: React.FC<CharacterTableCellProps> = ({ item, onCharClick }) => {
  if (!item) {
    return <div className="h-16 sm:h-20 border border-slate-200 bg-slate-50"></div>;
  }
  
  const handleClick = () => {
    if (onCharClick && item) { // Ensure item is not null before calling
      onCharClick(item);
    }
  };

  return (
    <div 
      className={`h-16 sm:h-20 p-1 border border-slate-200 bg-white flex flex-col justify-center items-center text-center transition-all duration-150 ease-in-out group-hover:scale-105 group-hover:shadow-md ${onCharClick ? 'cursor-pointer hover:bg-sky-100' : ''}`}
      onClick={onCharClick ? handleClick : undefined}
      role={onCharClick ? "button" : undefined}
      tabIndex={onCharClick ? 0 : undefined}
      onKeyPress={onCharClick ? (e) => (e.key === 'Enter' || e.key === ' ') && handleClick() : undefined}
      aria-label={onCharClick && item ? `Phát âm ${item.char}` : undefined}
    >
      <div className="font-['Noto_Sans_JP'] text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">
        {item.char}
      </div>
      <div className="text-[10px] sm:text-xs text-blue-600 font-medium">
        {'note' in item && item.note ? item.note : item.romaji.split(' ')[0]}
      </div>
    </div>
  );
};

interface CharacterTableProps {
  data: OrganizedTableData;
  sectionId: string;
  onCharClick?: (charItem: JapaneseCharacter | { char: string; romaji: string; note?: string }) => void;
}

const CharacterTable: React.FC<CharacterTableProps> = ({ data, sectionId, onCharClick }) => {
  const { title, columnHeaders, rows, footerChar, icon } = data;

  return (
    <section className="mb-10 sm:mb-16" id={sectionId}>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-700 mb-4 sm:mb-6 pb-2 border-b-2 border-blue-300 flex items-center">
         {icon && <i className={`${icon} mr-2 sm:mr-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-2xl sm:text-3xl`}></i>}
        {title}
      </h2>
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full border-collapse border border-slate-300 bg-white">
          {columnHeaders && (
            <thead>
              <tr className="bg-sky-100">
                <th className="p-2 sm:p-3 border border-slate-300 text-xs sm:text-sm font-semibold text-slate-600 w-1/6 sticky left-0 bg-sky-100 z-20">Hàng/Cột</th>
                {columnHeaders.map((header, index) => (
                  <th key={index} className="p-2 sm:p-3 border border-slate-300 text-xs sm:text-sm font-semibold text-slate-600">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={`group ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-sky-50/50'}`}>
                <td className="p-2 sm:p-3 border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 text-center sticky left-0 bg-inherit z-10">
                  <div>{row.rowHeader}</div>
                  {row.rowSubHeader && <div className="text-[10px] text-blue-500">({row.rowSubHeader})</div>}
                </td>
                {row.cells.map((cellData, cellIndex) => (
                  <td key={cellIndex} className="border-r border-slate-200 p-0 m-0"> {/* Make parent TD a group for hover */}
                    <CharacterTableCell item={cellData} onCharClick={onCharClick} />
                  </td>
                ))}
              </tr>
            ))}
            {footerChar && (
                 <tr className="group">
                    <td colSpan={ (columnHeaders?.length || 0) +1 } className="p-0 m-0 border-t-2 border-slate-400">
                         <CharacterTableCell item={footerChar} onCharClick={onCharClick} />
                    </td>
                 </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CharacterTable;
