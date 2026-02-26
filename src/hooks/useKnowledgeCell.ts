/**
 * 🧬 Hook React para interactuar con Knowledge Cells
 */

import { useState, useEffect, useCallback } from 'react';
import { knowledgeRepo } from '@/core/knowledge';
import { KnowledgeCell, CellType } from '@/core/knowledge/KnowledgeCell.types';

export const useKnowledgeCell = (cellId?: string) => {
  const [cell, setCell] = useState<KnowledgeCell | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cellId) {
      const foundCell = knowledgeRepo.getCell(cellId);
      setCell(foundCell);
    }
  }, [cellId]);

  const executeCell = useCallback(async (input: any) => {
    if (!cell) {
      setError('Cell not found');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulación de ejecución - en producción se llamaría al microservicio
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = {
        success: true,
        output: { processed: true, input },
        performance: {
          executionTime: 100,
          resourceUsage: 0.5
        }
      };

      setLoading(false);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      setLoading(false);
      return null;
    }
  }, [cell]);

  return {
    cell,
    loading,
    error,
    executeCell
  };
};

export const useKnowledgeCellsByType = (type: CellType) => {
  const [cells, setCells] = useState<KnowledgeCell[]>([]);

  useEffect(() => {
    const foundCells = knowledgeRepo.getCellsByType(type);
    setCells(foundCells);
  }, [type]);

  return cells;
};

export const useKnowledgeRepository = () => {
  const [repo, setRepo] = useState(knowledgeRepo.getRepository());

  const refresh = useCallback(() => {
    setRepo(knowledgeRepo.getRepository());
  }, []);

  return {
    repo,
    refresh,
    getAllCells: () => knowledgeRepo.getAllCells(),
    getCellsByType: (type: CellType) => knowledgeRepo.getCellsByType(type),
    getCell: (id: string) => knowledgeRepo.getCell(id)
  };
};
