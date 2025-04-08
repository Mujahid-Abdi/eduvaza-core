import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Save, X, Plus, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface EditableQuestion {
  id: number;
  question: string;
  type: string;
  difficulty: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
}

interface QuestionEditorProps {
  questions: EditableQuestion[];
  onQuestionsChange: (questions: EditableQuestion[]) => void;
}

export const QuestionEditor = ({ questions, onQuestionsChange }: QuestionEditorProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditableQuestion | null>(null);

  const handleEdit = (question: EditableQuestion) => {
    setEditingId(question.id);
    setEditForm({ ...question });
  };

  const handleSave = () => {
    if (!editForm) return;
    onQuestionsChange(
      questions.map(q => (q.id === editForm.id ? editForm : q))
    );
    setEditingId(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: number) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!editForm || !editForm.options) return;
    const newOptions = [...editForm.options];
    newOptions[index] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const addOption = () => {
    if (!editForm) return;
    const options = editForm.options || [];
    const letter = String.fromCharCode(65 + options.length);
    setEditForm({ ...editForm, options: [...options, `${letter}. New option`] });
  };

  const removeOption = (index: number) => {
    if (!editForm || !editForm.options) return;
    const newOptions = editForm.options.filter((_, i) => i !== index);
    setEditForm({ ...editForm, options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit Questions ({questions.length})</h3>
        <Badge variant="outline">Click to edit any question</Badge>
      </div>

      {questions.map((q, index) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {editingId === q.id && editForm ? (
            <Card className="border-primary shadow-lg">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge>Editing Question {index + 1}</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Textarea
                      value={editForm.question}
                      onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                      placeholder="Enter question text"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={editForm.type}
                        onValueChange={(v) => setEditForm({ ...editForm, type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="short_answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select
                        value={editForm.difficulty}
                        onValueChange={(v) => setEditForm({ ...editForm, difficulty: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {editForm.type !== 'short_answer' && editForm.options && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Options</Label>
                        <Button size="sm" variant="outline" onClick={addOption}>
                          <Plus className="h-3 w-3 mr-1" /> Add Option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {editForm.options.map((opt, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Input
                              value={opt}
                              onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                              className="flex-1"
                            />
                            {editForm.options && editForm.options.length > 2 && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeOption(optIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Input
                        value={editForm.correctAnswer}
                        onChange={(e) => setEditForm({ ...editForm, correctAnswer: e.target.value })}
                        placeholder="e.g., A"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Explanation</Label>
                    <Textarea
                      value={editForm.explanation}
                      onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                      placeholder="Explain why this is the correct answer"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleEdit(q)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {q.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {q.difficulty}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm line-clamp-2">{q.question}</p>
                      {q.options && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {q.options.length} options • Answer: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(q);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(q.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      ))}

      {questions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          <p>No questions to edit. Generate questions first.</p>
        </div>
      )}
    </div>
  );
};
