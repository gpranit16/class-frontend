import React from 'react';
import { GRADE_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { MarksEntry } from '../../types';

interface ResultsCardProps {
  results: MarksEntry[];
}

const ResultsCard: React.FC<ResultsCardProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No results available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.slice(0, 5).map((result) => (
        <div
          key={result._id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{result.examName}</p>
            <p className="text-xs text-gray-500">{result.subject} • {formatDate(result.examDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">
              {result.marksObtained}/{result.totalMarks}
            </p>
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${GRADE_COLORS[result.grade] || 'bg-gray-100 text-gray-800'}`}>
              {result.grade}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsCard;
