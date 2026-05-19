"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  getWalkthrough,
  updateWalkthrough,
  createStep,
  updateStep,
  deleteStep,
  createChoice,
  updateChoice,
  deleteChoice,
} from "@/lib/admin-api";
import type {
  AdminWalkthrough,
  AdminWalkthroughStep,
  AdminStepChoice,
} from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

export default function EditWalkthroughPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [walkthrough, setWalkthrough] = useState<AdminWalkthrough | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("linear");
  const [publish, setPublish] = useState(false);

  function loadWalkthrough() {
    getWalkthrough(Number(id)).then((res) => {
      const wt = res.data;
      setWalkthrough(wt);
      setTitle(wt.title);
      setSlug(wt.slug);
      setDescription(wt.description || "");
      setType(wt.type);
      setPublish(!!wt.published_at);
    });
  }

  useEffect(() => {
    loadWalkthrough();
  }, [id]);

  async function handleSave() {
    setLoading(true);
    try {
      await updateWalkthrough(Number(id), {
        title,
        slug,
        description: description || null,
        type: type as "linear" | "decision_tree",
        published_at: publish ? new Date().toISOString() : null,
      });
      toast.success("Walkthrough updated");
      loadWalkthrough();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStep() {
    try {
      await createStep(Number(id), { title: "New Step", body: "" });
      toast.success("Step added");
      loadWalkthrough();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add step");
    }
  }

  async function handleUpdateStep(
    stepId: number,
    data: Partial<AdminWalkthroughStep>
  ) {
    await updateStep(Number(id), stepId, data);
    loadWalkthrough();
  }

  async function handleDeleteStep(stepId: number) {
    await deleteStep(Number(id), stepId);
    toast.success("Step deleted");
    loadWalkthrough();
  }

  async function handleAddChoice(stepId: number) {
    await createChoice(stepId, { label: "New Choice" });
    loadWalkthrough();
  }

  async function handleUpdateChoice(
    stepId: number,
    choiceId: number,
    data: Partial<AdminStepChoice>
  ) {
    await updateChoice(stepId, choiceId, data);
    loadWalkthrough();
  }

  async function handleDeleteChoice(stepId: number, choiceId: number) {
    await deleteChoice(stepId, choiceId);
    loadWalkthrough();
  }

  if (!walkthrough)
    return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Walkthrough</h1>
        <Button variant="outline" onClick={() => router.push("/admin/walkthroughs")}>
          Back to list
        </Button>
      </div>

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="decision_tree">Decision Tree</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <Switch
                checked={publish}
                onCheckedChange={setPublish}
                id="publish"
              />
              <Label htmlFor="publish">Published</Label>
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Details"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Steps</h2>
          <Button onClick={handleAddStep} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        {walkthrough.steps?.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            walkthroughType={type}
            allSteps={walkthrough.steps || []}
            onUpdate={(data) => handleUpdateStep(step.id, data)}
            onDelete={() => handleDeleteStep(step.id)}
            onAddChoice={() => handleAddChoice(step.id)}
            onUpdateChoice={(choiceId, data) =>
              handleUpdateChoice(step.id, choiceId, data)
            }
            onDeleteChoice={(choiceId) =>
              handleDeleteChoice(step.id, choiceId)
            }
          />
        ))}

        {(!walkthrough.steps || walkthrough.steps.length === 0) && (
          <p className="text-muted-foreground text-center py-8">
            No steps yet. Add one to get started.
          </p>
        )}
      </div>
    </div>
  );
}

function StepCard({
  step,
  walkthroughType,
  allSteps,
  onUpdate,
  onDelete,
  onAddChoice,
  onUpdateChoice,
  onDeleteChoice,
}: {
  step: AdminWalkthroughStep;
  walkthroughType: string;
  allSteps: AdminWalkthroughStep[];
  onUpdate: (data: Partial<AdminWalkthroughStep>) => void;
  onDelete: () => void;
  onAddChoice: () => void;
  onUpdateChoice: (choiceId: number, data: Partial<AdminStepChoice>) => void;
  onDeleteChoice: (choiceId: number) => void;
}) {
  const [title, setTitle] = useState(step.title);
  const [body, setBody] = useState(step.body || "");
  const [imageUrl, setImageUrl] = useState(step.image_url || "");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Step {step.position}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Step title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title !== step.title) onUpdate({ title });
          }}
        />
        <Textarea
          placeholder="Step body (markdown)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onBlur={() => {
            if (body !== (step.body || "")) onUpdate({ body });
          }}
          rows={4}
          className="font-mono text-sm"
        />
        <Input
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onBlur={() => {
            if (imageUrl !== (step.image_url || ""))
              onUpdate({ image_url: imageUrl || null });
          }}
        />

        {walkthroughType === "decision_tree" && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Choices</Label>
              <Button variant="outline" size="sm" onClick={onAddChoice}>
                <Plus className="h-3 w-3 mr-1" />
                Add Choice
              </Button>
            </div>
            {step.choices?.map((choice) => (
              <div key={choice.id} className="flex gap-2 items-center">
                <Input
                  className="flex-1"
                  defaultValue={choice.label}
                  placeholder="Choice label"
                  onBlur={(e) => {
                    if (e.target.value !== choice.label)
                      onUpdateChoice(choice.id, { label: e.target.value });
                  }}
                />
                <Select
                  defaultValue={
                    choice.next_step_id ? String(choice.next_step_id) : ""
                  }
                  onValueChange={(val) =>
                    onUpdateChoice(choice.id, {
                      next_step_id: val ? Number(val) : null,
                    })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Next step" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSteps
                      .filter((s) => s.id !== step.id)
                      .map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          Step {s.position}: {s.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteChoice(choice.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
